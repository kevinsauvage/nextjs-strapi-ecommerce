import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import routes from '@/data/routes';
import nextApiCall from '@/utils/apiNext';

import useLocalStorage from '@/hooks/useLocalStorage';

import {
  getUser,
  loginCustomer,
  registerCustomer,
  sendRecoverEmail,
  resetCustomerPassword,
  refreshToken,
} from '@/lib/shopify/customer/customerApiCall';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const [token, setToken] = useLocalStorage('customerAccessToken_shopify', '');
  const [userAccessToken, setUserAccessToken] = useState(null);

  const router = useRouter();

  const toggleLoading = useCallback((loading) => {
    dispatch({ type: actions.CHANGE_LOADING, payload: loading });
  }, []);

  const logout = useCallback(async () => {
    toggleLoading(true);

    const res = await nextApiCall.auth.logout();
    setToken(null);
    setUserAccessToken(null);

    if (res && res.ok) {
      dispatch({ type: actions.REMOVE_USER });
      router.push(routes.base.home);
      toggleLoading(false);
    } else {
      toast.error('Something went wrong, please try again');
    }
  }, [router, setToken, toggleLoading]);

  const getUserInfo = useCallback(
    async (accessToken) => {
      if (!states?.user?.id) {
        console.log('Get user info');
        const response = await getUser(accessToken);
        if (response?.customer) {
          dispatch({ type: actions.ADD_USER, payload: response.customer });
        }
      }
    },
    [states.user.id]
  );

  const handleToken = useCallback(
    async (customerAccessToken) => {
      // Send token to server to store it inside cookies
      const res2 = await nextApiCall.auth.login(customerAccessToken);

      // Save token to local storage
      setToken({
        ...customerAccessToken,
        expire: new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
      });

      setUserAccessToken(customerAccessToken?.accessToken);

      toggleLoading(false);

      if (res2?.ok) return true;
      return false;
    },
    [setToken, toggleLoading]
  );

  const handleRefreshToken = useCallback(
    async (accessToken) => {
      const response = await refreshToken(accessToken);
      console.log(response, 'refresh token received');
      const { customerAccessToken } = response || {};
      if (customerAccessToken) handleToken(customerAccessToken);
    },
    [handleToken]
  );

  const login = useCallback(
    async (email, password) => {
      if (!email || !password) {
        return toast.error('Fill in missing required fields');
      }
      console.log('login');
      toggleLoading(true);

      const data = await loginCustomer({ email, password });

      const { customerAccessToken, customerUserErrors } = data;

      if (customerAccessToken?.accessToken) {
        getUserInfo(customerAccessToken.accessToken); // Fetch user information after successful login

        const res = await handleToken(customerAccessToken); // Set cookie token

        if (res) {
          toast.success('Your login was successful');
          router.push(routes.base.profile);
        }
      }

      if (customerUserErrors && customerUserErrors?.length > 0) {
        toggleLoading(false);
        return customerUserErrors.forEach((err) => toast.error(err.message));
      }

      return false;
    },
    [getUserInfo, handleToken, router, toggleLoading]
  );

  const register = useCallback(
    async (email, password) => {
      if (!email || !password) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);
      const data = await registerCustomer({ email, password });
      toggleLoading(false);

      if (!data) return toast.error('Something went wrong');

      const { customer, userErrors } = data;

      if (userErrors && userErrors.length > 0) {
        userErrors.forEach((err) => toast.error(err.message));
      }

      if (customer) return login(email, password);

      return false;
    },
    [login, toggleLoading]
  );

  const resetPasswordEmail = useCallback(
    async (email) => {
      if (!email) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);
      const data = await sendRecoverEmail(email);
      toggleLoading(false);

      const { customerUserErrors } = data || {};

      if (customerUserErrors && customerUserErrors.length > 0) {
        return customerUserErrors.forEach((err) => toast.error(err.message));
      }

      return toast.success('Check your emails');
    },
    [toggleLoading]
  );

  const resetPassword = useCallback(
    async (password, url) => {
      if (!password || !url) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);
      const data = await resetCustomerPassword(password, url);
      const { customerUserErrors, customerAccessToken } = data || {};

      if (customerUserErrors && customerUserErrors.length > 0) {
        toggleLoading(false);

        return customerUserErrors.forEach((err) => toast.error(err.message));
      }
      if (customerAccessToken && customerAccessToken.accessToken) {
        toggleLoading(false);

        const res = await handleToken(customerAccessToken);
        if (res) router.push(routes.base.profile);
      }
      toggleLoading(false);

      return toast.success('Password has been updated successfully');
    },
    [handleToken, router, toggleLoading]
  );

  useEffect(() => {
    if (token?.accessToken) {
      const expireInMilliseconds = new Date(token.expiresAt).getTime();
      const todayInMilliseconds = new Date().getTime();

      // If shopify token or local storage TOKEN is expired logout immediately
      if (
        expireInMilliseconds < todayInMilliseconds ||
        Number(token.expire) < todayInMilliseconds
      ) {
        logout();
      }
      console.log('run');

      // If the shopify token of local storage token is going to expire soon, refresh the token
      if (
        expireInMilliseconds < todayInMilliseconds - 60 * 60 ||
        Number(token.expire) < todayInMilliseconds - 60 * 60
      ) {
        handleRefreshToken(token.accessToken);
        return;
      }

      setUserAccessToken(token.accessToken);

      // If no user is saved, fetch user information
      if (!states?.user?.id) {
        getUserInfo(token.accessToken);
      }
    } else if (states?.user?.id) {
      console.log('remove user');
      dispatch({ type: actions.REMOVE_USER });
    }
  }, [
    getUserInfo,
    handleRefreshToken,
    logout,
    states?.user?.id,
    token,
    userAccessToken,
  ]);

  const values = useMemo(
    () => ({
      // States
      user: states.user,
      loading: states.loading,
      userAccessToken,

      // Functions
      login,
      register,
      resetPasswordEmail,
      toggleLoading,
      resetPassword,
      logout,
    }),
    [
      states,
      login,
      register,
      resetPasswordEmail,
      toggleLoading,
      resetPassword,
      logout,
      userAccessToken,
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
