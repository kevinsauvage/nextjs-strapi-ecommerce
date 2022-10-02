import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import routes from '@/data/routes';
import nextApiCall from '@/utils/apiNext';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  sendRecoverEmail,
  resetCustomerPassword,
  refreshToken,
} from '@/lib/shopify/customer/customerApiCall';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const [token, setToken] = useLocalStorage('customerAccessToken_shopify', '');
  const [accessToken, setAccessToken] = useState(undefined);

  const { user } = states || {};

  const router = useRouter();
  const { push } = router;

  const toggleLoading = useCallback((loading) => {
    dispatch({ type: actions.CHANGE_LOADING, payload: loading });
  }, []);

  const handleError = useCallback(
    (err) => {
      if (Array.isArray(err)) {
        toggleLoading(false);
        return err.forEach((e) => toast.error(e.message));
      }
      return false;
    },
    [toggleLoading]
  );

  const logout = useCallback(async () => {
    toggleLoading(true);
    const res = await nextApiCall.auth.logout();
    toggleLoading(false);

    if (res && res.ok) {
      setToken(null);
      dispatch({ type: actions.REMOVE_USER });
      push(routes.home);
    } else {
      toast.error('Something went wrong, please try again');
    }
  }, [push, setToken, toggleLoading]);

  const handleToken = useCallback(
    async (customerAccessToken, redirectPath, successMessage = '') => {
      // Save token to local storage
      console.log('handleToken');

      setAccessToken(customerAccessToken.accessToken);
      setToken({
        ...customerAccessToken,
        expire: new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
      });

      // Send token to server to store it inside cookies
      const res = await nextApiCall.auth.saveToken({ customerAccessToken });

      const { customer } = res || {};

      if (customer?.id) dispatch({ type: actions.ADD_USER, payload: customer });

      toggleLoading(false);

      if (res?.ok) {
        if (successMessage) toast.success(successMessage);
        if (redirectPath) push(redirectPath);
      }
      return false;
    },
    [setToken, toggleLoading, push]
  );

  const handleRefreshToken = useCallback(
    async (tok) => {
      const response = await refreshToken(tok);
      const { customerAccessToken } = response || {};
      if (customerAccessToken?.accessToken) handleToken(customerAccessToken);
    },
    [handleToken]
  );

  const login = useCallback(
    async (email, password) => {
      if (!email || !password)
        return toast.error('Fill in missing required fields');

      toggleLoading(true);

      const res = await nextApiCall.auth.login({ email, password });

      const { customerUserErrors, customerAccessToken } = res || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (customerAccessToken?.accessToken) {
        return handleToken(
          customerAccessToken,
          routes.account,
          'Your login was successful'
        );
      }

      return false;
    },
    [handleToken, toggleLoading, handleError]
  );

  const register = useCallback(
    async (email, password) => {
      if (!email || !password) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);

      const data = await nextApiCall.auth.register({ email, password });
      if (!data) return toast.error('Something went wrong');
      const { userErrors, customerAccessToken } = data;
      if (userErrors?.length) return handleError(userErrors);

      if (customerAccessToken?.accessToken) {
        handleToken(
          customerAccessToken,
          routes.account,
          'You are now Registered'
        );
      }

      return false;
    },
    [toggleLoading, handleToken, handleError]
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
      if (customerUserErrors?.length) return handleError(customerUserErrors);
      return toast.success('Check your emails');
    },
    [toggleLoading, handleError]
  );

  const resetPassword = useCallback(
    async (password, url) => {
      if (!password || !url) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);

      const data = await resetCustomerPassword(password, url);
      const { customerUserErrors, customerAccessToken } = data || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (customerAccessToken?.accessToken) {
        handleToken(
          customerAccessToken,
          routes.account,
          'Password correctly updated'
        );
      }
      return true;
    },
    [handleToken, toggleLoading, handleError]
  );

  useEffect(() => {
    if (token?.accessToken && !accessToken) {
      console.log('run 1');
      const expireInMilliseconds = new Date(token.expiresAt).getTime();
      const todayInMilliseconds = new Date().getTime();

      // If shopify token or local storage TOKEN is expired logout immediately
      if (
        expireInMilliseconds < todayInMilliseconds ||
        Number(token.expire) < todayInMilliseconds
      ) {
        logout();
      }

      // If the shopify token of local storage token is going to expire soon, refresh the token
      if (
        expireInMilliseconds < todayInMilliseconds - 60 * 60 ||
        Number(token.expire) < todayInMilliseconds - 60 * 60
      ) {
        handleRefreshToken(token.accessToken);
      }
    }
  }, [handleToken, handleRefreshToken, logout, token, accessToken]);

  useEffect(() => {
    if (!user?.id && token?.accessToken && !accessToken) {
      console.log('run 2');
      handleToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    console.log('run empty');
  }, []);
  const values = useMemo(
    () => ({
      // States
      user,
      loading: states.loading,
      token,

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
      token,
      user,
      login,
      register,
      resetPasswordEmail,
      toggleLoading,
      resetPassword,
      logout,
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
