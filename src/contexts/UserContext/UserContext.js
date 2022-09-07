import { useRouter } from 'next/router';
import { createContext, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';
import routes from '@/data/routes';
import {
  loginCustomer,
  registerCustomer,
  sendRecoverEmail,
  resetCustomerPassword,
} from '@/lib/shopify';
import nextApiCall from '@/utils/apiNext';

import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const router = useRouter();

  const handleToken = async (customerAccessToken) => {
    // Send token to server to store it inside cookies
    const res2 = await nextApiCall.auth.login(customerAccessToken);
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
    const data = await loginCustomer(email, password, router.locale);

    const { customerAccessTokenCreate } = data;

    const customerAccessToken = customerAccessTokenCreate?.customerAccessToken;
    const customerUserErrors = customerAccessTokenCreate?.customerUserErrors;

    if (customerAccessToken) handleToken(customerAccessToken);

    if (customerUserErrors && customerUserErrors?.length > 0) {
      customerUserErrors.forEach((err) => toast.error(err.message));
    }
  };

  const register = async (email, password) => {
    if (!email || !password) {
      toast.error('Fill in missing required fields');
      return;
    }
    const data = await registerCustomer(email, password, router.locale);

    const { customerCreate } = data;

    if (customerCreate && customerCreate.userErrors.length > 0) {
      customerCreate.userErrors.forEach((err) => toast.error(err.message));
    }
    if (customerCreate && customerCreate.customer) login(email, password);
  };

  const resetPasswordEmail = async (email) => {
    if (!email) {
      toast.error('Fill in missing required fields');
    }

    const data = await sendRecoverEmail(email, router.locale);
    const customerRecover = data?.customerRecover;
    const customerErrors = customerRecover?.customerUserErrors;

    console.log(data);

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
    const data = await resetCustomerPassword(password, url, router.locale);

    const { customerResetByUrl } = data;

    const customerUserErrors = customerResetByUrl?.customerUserErrors;
    const customerAccessToken = customerResetByUrl?.customerAccessToken;

    if (customerUserErrors && customerUserErrors.length > 0) {
      customerUserErrors.forEach((err) => toast.error(err.message));
    } else if (customerAccessToken && customerAccessToken.accessToken) {
      handleToken(customerAccessToken);
    }
  };

  const logout = async () => {
    const res = await nextApiCall.auth.logout();

    if (res && res.ok) {
      dispatch({ type: actions.REMOVE_USER });
      router.push(routes.base.home);
    } else {
      // handle error here
    }
  };

  const values = useMemo(
    () => ({
      // States
      user: states.user,

      // Functions
      addUser: (payload) => dispatch({ type: actions.ADD_USER, payload }),
      login,
      register,
      resetPasswordEmail,
      resetPassword,
      logout,
    }),
    [states]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
