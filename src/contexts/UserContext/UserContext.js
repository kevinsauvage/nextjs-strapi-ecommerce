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
} from '@/lib/shopify/customer';

import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children, token }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const router = useRouter();
  const { locale } = router;

  const toggleLoading = (loading) =>
    dispatch({ type: actions.CHANGE_LOADING, payload: loading });

  const logout = async () => {
    toggleLoading(true);
    const res = await nextApiCall.auth.logout();
    if (res && res.ok) {
      dispatch({ type: actions.REMOVE_USER });
      router.push(routes.base.home);
      toggleLoading(false);
    } else {
      // handle error here
    }
  };

  const getUserInfo = async (accessToken) => {
    const response = await getUser(accessToken, locale);

    console.log('getUserInfo res', response);

    if (response.customer) {
      dispatch({ type: actions.ADD_USER, payload: response.customer });
    }
  };

  useEffect(() => {
    if (token && !states?.user?.id) getUserInfo(token);
    else if (!token && states?.user?.id) logout();
  }, [token]);

  const handleToken = async (customerAccessToken) => {
    // Send token to server to store it inside cookies
    const res2 = await nextApiCall.auth.login(customerAccessToken);
    toggleLoading(false);
    if (res2?.ok) {
      toast.success('Your login was successful');
      router.push(routes.base.profile);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      toast.error('Fill in missing required fields');
      return;
    }
    toggleLoading(true);
    console.log('Login', email, password);
    const data = await loginCustomer(email, password, router.locale);

    const { customerAccessTokenCreate } = data;

    const customerAccessToken = customerAccessTokenCreate?.customerAccessToken;
    const customerUserErrors = customerAccessTokenCreate?.customerUserErrors;

    if (customerAccessToken) {
      console.log('getUserInfo', customerAccessToken);

      getUserInfo(customerAccessToken.accessToken);
      handleToken(customerAccessToken);
    }

    if (customerUserErrors && customerUserErrors?.length > 0) {
      toggleLoading(false);
      customerUserErrors.forEach((err) => toast.error(err.message));
    }
  };

  const register = async (email, password) => {
    if (!email || !password) {
      toast.error('Fill in missing required fields');
      return;
    }
    toggleLoading(true);
    const data = await registerCustomer(email, password, router.locale);

    const { customerCreate } = data;

    if (customerCreate && customerCreate.userErrors.length > 0) {
      toggleLoading(false);
      customerCreate.userErrors.forEach((err) => toast.error(err.message));
    }
    if (customerCreate && customerCreate.customer) login(email, password);
  };

  const resetPasswordEmail = async (email) => {
    if (!email) {
      toast.error('Fill in missing required fields');
    }
    toggleLoading(true);

    const data = await sendRecoverEmail(email, router.locale);
    const customerRecover = data?.customerRecover;
    const customerErrors = customerRecover?.customerUserErrors;
    toggleLoading(false);

    if (customerErrors && customerErrors.length > 0) {
      customerErrors.forEach((err) => toast.error(err.message));
    } else {
      toast.success('Check your emails');
    }
  };

  const resetPassword = async (password, url) => {
    if (!password || !url) {
      toast.error('Fill in missing required fields');
    }
    toggleLoading(true);

    const data = await resetCustomerPassword(password, url, router.locale);

    const { customerResetByUrl } = data;

    const customerUserErrors = customerResetByUrl?.customerUserErrors;
    const customerAccessToken = customerResetByUrl?.customerAccessToken;

    if (customerUserErrors && customerUserErrors.length > 0) {
      toggleLoading(false);
      customerUserErrors.forEach((err) => toast.error(err.message));
    } else if (customerAccessToken && customerAccessToken.accessToken) {
      handleToken(customerAccessToken);
    }
  };

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
