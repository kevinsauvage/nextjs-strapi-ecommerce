import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';
import routes from '@/data/routes';
import nextApiCall from '@/utils/apiNext';
import {
  loginCustomer,
  registerCustomer,
  sendRecoverEmail,
  resetCustomerPassword,
  getUser,
  refreshToken,
} from '@/lib/shopify/customer';

import useLocalStorage from '@/hooks/useLocalStorage';

import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const [token, setToken] = useLocalStorage('customerAccessToken_shopify', '');

  const router = useRouter();
  const { locale } = router;

  const toggleLoading = (loading) =>
    dispatch({ type: actions.CHANGE_LOADING, payload: loading });

  const logout = async () => {
    toggleLoading(true);

    const res = await nextApiCall.auth.logout();
    setToken(null);

    if (res && res.ok) {
      dispatch({ type: actions.REMOVE_USER });
      router.push(routes.base.home);
      toggleLoading(false);
    } else {
      toast.error('Something went wrong, please try again');
    }
  };

  const getUserInfo = async (accessToken) => {
    const response = await getUser(accessToken, locale);
    if (response.customer) {
      dispatch({ type: actions.ADD_USER, payload: response.customer });
    }
  };

  const handleToken = async (customerAccessToken) => {
    // Send token to server to store it inside cookies
    const res2 = await nextApiCall.auth.login(customerAccessToken);

    // Save token to local storage
    setToken({
      ...customerAccessToken,
      expire: new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
    });

    toggleLoading(false);

    if (res2?.ok) return true;
    return false;
  };

  const handleRefreshToken = async (accessToken) => {
    const response = await refreshToken(accessToken);
    if (response?.refresh) handleToken(response.refresh);
  };

  const login = async (email, password) => {
    if (!email || !password) {
      return toast.error('Fill in missing required fields');
    }
    toggleLoading(true);

    const data = await loginCustomer(email, password, router.locale);
    const { customerAccessTokenCreate } = data;
    const customerAccessToken = customerAccessTokenCreate?.customerAccessToken;
    const customerUserErrors = customerAccessTokenCreate?.customerUserErrors;

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
  };

  const register = async (email, password) => {
    if (!email || !password) {
      return toast.error('Fill in missing required fields');
    }

    toggleLoading(true);

    const data = await registerCustomer(email, password, router.locale);
    const { customerCreate } = data;

    if (customerCreate && customerCreate.userErrors.length > 0) {
      toggleLoading(false);
      return customerCreate.userErrors.forEach((err) =>
        toast.error(err.message)
      );
    }

    if (customerCreate && customerCreate.customer)
      return login(email, password);

    return false;
  };

  const resetPasswordEmail = async (email) => {
    if (!email) {
      return toast.error('Fill in missing required fields');
    }

    toggleLoading(true);
    const data = await sendRecoverEmail(email, router.locale);
    const customerRecover = data?.customerRecover;
    const customerErrors = customerRecover?.customerUserErrors;
    toggleLoading(false);

    if (customerErrors && customerErrors.length > 0) {
      return customerErrors.forEach((err) => toast.error(err.message));
    }

    return toast.success('Check your emails');
  };

  const resetPassword = async (password, url) => {
    if (!password || !url) {
      return toast.error('Fill in missing required fields');
    }
    toggleLoading(true);

    const data = await resetCustomerPassword(password, url, router.locale);
    const { customerResetByUrl } = data;
    const customerUserErrors = customerResetByUrl?.customerUserErrors;
    const customerAccessToken = customerResetByUrl?.customerAccessToken;

    if (customerUserErrors && customerUserErrors.length > 0) {
      toggleLoading(false);
      return customerUserErrors.forEach((err) => toast.error(err.message));
    }
    if (customerAccessToken && customerAccessToken.accessToken) {
      const res = handleToken(customerAccessToken);
      if (res) router.push(routes.base.profile);
    }

    return toast.success('Password has been updated successfully');
  };

  useEffect(() => {
    if (token?.accessToken) {
      const expireInMilliseconds = new Date(token.expiresAt).getTime();
      const todayInMilliseconds = new Date().getTime();

      // If shopify token or local storage TOKEN is expired logout immediately
      if (
        expireInMilliseconds < todayInMilliseconds ||
        Number(token.expire) < todayInMilliseconds
      ) {
        console.log('Expired');
        logout();
      }

      // If the shopify token of local storage token is going to expire soon, refresh the tokens
      if (
        expireInMilliseconds < todayInMilliseconds - 60 * 60 ||
        Number(token.expire) < todayInMilliseconds - 60 * 60
      ) {
        handleRefreshToken(token.accessToken);
        return;
      }

      // If no user is saved, fetch user information
      if (!states?.user?.id) {
        getUserInfo(token.accessToken);
      }
    } else {
      dispatch({ type: actions.REMOVE_USER });
    }
  }, []);

  const values = useMemo(
    () => ({
      // States
      user: states.user,
      loading: states.loading,

      // Functions
      login,
      register,
      resetPasswordEmail,
      toggleLoading,
      resetPassword,
      logout,
    }),
    [states]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
