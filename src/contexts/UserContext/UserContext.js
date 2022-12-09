import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  sendRecoverEmail,
  resetCustomerPassword,
  refreshToken,
  getUser,
} from '@/lib/shopify/customer/customerApiCall';
import config from '@/config/index';

import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const [token, setToken] = useLocalStorage('accessToken', '');
  const ttl = 12 * 60 * 60;

  const { user, loading } = states || {};

  const router = useRouter();
  const { push } = router;

  const toggleLoading = useCallback((loadingState) => {
    dispatch({ type: actions.CHANGE_LOADING, payload: loadingState });
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
      push(config.routes.home);
    } else {
      toast.error('Something went wrong, please try again');
    }
  }, [push, setToken, toggleLoading]);

  const handleRefreshToken = useCallback(
    async (tok) => {
      if (!tok) return;
      const { customerAccessToken } = (await refreshToken(tok)) || {};
      const { accessToken } = customerAccessToken || {};
      if (accessToken) {
        nextApiCall.saveToken({ accessToken });
        setToken(accessToken, ttl);
      }
    },
    [ttl, setToken]
  );

  const login = useCallback(
    async (email, password) => {
      if (!email || !password)
        return toast.error('Fill in missing required fields');

      toggleLoading(true);

      const { customerUserErrors, accessToken, customer, ok } =
        (await nextApiCall.auth.login({ email, password })) || {};
      toggleLoading(false);

      if (!ok) return toast.error('Something went wrong');

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (accessToken) setToken(accessToken, ttl);

      if (customer?.id) {
        dispatch({ type: actions.ADD_USER, payload: customer });
        push(config.routes.account);
      }

      toast.success('You were successfully logged in.');

      return false;
    },
    [toggleLoading, handleError, push, setToken, ttl]
  );

  const register = useCallback(
    async (email, password) => {
      if (!email || !password) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);
      const registerRes = await nextApiCall.auth.register({ email, password });
      toggleLoading(false);

      const { userErrors, accessToken, customer, ok } = registerRes || {};

      if (!ok) return toast.error('Something went wrong');

      if (userErrors?.length) return handleError(userErrors);

      toast.success('You were successfully registered');

      if (accessToken) setToken(accessToken, ttl);

      if (customer?.id) {
        dispatch({ type: actions.ADD_USER, payload: customer });
        push(config.routes.account);
      }

      return false;
    },
    [toggleLoading, handleError, setToken, push, ttl]
  );

  const resetPasswordEmail = useCallback(
    async (email) => {
      if (!email) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);

      const data = await sendRecoverEmail(email);

      toggleLoading(false);

      const { errors } = data || {};
      if (errors?.length) return handleError(errors);
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
      toggleLoading(false);

      const { customerUserErrors, customerAccessToken, customer } = data || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      const { accessToken } = customerAccessToken || {};

      if (accessToken) {
        await nextApiCall.saveToken({ accessToken });
        setToken(accessToken, ttl);
      }

      if (customer?.id) {
        dispatch({ type: actions.ADD_USER, payload: customer });
        toast.success('Password correctly updated');
        push(config.routes.account);
      }

      return true;
    },
    [toggleLoading, handleError, push, ttl, setToken]
  );

  useEffect(() => {
    if (token?.value) {
      const now = new Date();

      if (now.getTime() > token.expiryTime * 1000) {
        logout();
      } else if (
        now.getTime() < token.expiryTime * 1000 &&
        now.getTime() > token.expiryTime * 1000 + 60 * 60 * 2
      ) {
        handleRefreshToken(token.value);
      }
    } else nextApiCall.auth.logout();
  }, [handleRefreshToken, logout, token]);

  useEffect(() => {
    if (!user?.id && token?.value) {
      getUser(token?.value).then((res) => {
        if (res?.customer)
          dispatch({ type: actions.ADD_USER, payload: res.customer });
      });
    }
  }, [token, user?.id]);

  const values = useMemo(
    () => ({
      // States
      user,
      loading,
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
      loading,
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
