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
import {
  sendRecoverEmail,
  resetCustomerPassword,
} from '@/lib/shopify/customer/customerApiCall';
import config from '@/config/index';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import { UserReducer, initialState, actions } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, loading } = states || {};
  const { handleAssociateCustomer } = useCheckoutContext();
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
    const res = await nextApiCall.logout();
    toggleLoading(false);

    if (res && res.ok) {
      dispatch({ type: actions.REMOVE_USER });
      push(config.routes.home);
    } else {
      toast.error('Something went wrong, please try again');
    }
  }, [push, toggleLoading]);

  const login = useCallback(
    async (email, password) => {
      if (!email || !password)
        return toast.error('Fill in missing required fields');

      toggleLoading(true);
      const resLogin = await nextApiCall.login({ email, password });
      toggleLoading(false);

      if (!resLogin?.ok) return toast.error('Something went wrong');

      const customerUserErrors = resLogin?.customerUserErrors;
      if (customerUserErrors?.length) return handleError(customerUserErrors);

      const customer = resLogin?.customer;
      if (customer?.id) {
        toast.success('You were successfully logged in.');
        dispatch({ type: actions.ADD_USER, payload: customer });
        handleAssociateCustomer();
        push(config.routes.account);
      }

      return false;
    },
    [toggleLoading, handleError, push, handleAssociateCustomer]
  );

  const register = useCallback(
    async (email, password) => {
      if (!email || !password) {
        return toast.error('Fill in missing required fields');
      }

      toggleLoading(true);
      const registerRes = await nextApiCall.register({ email, password });
      toggleLoading(false);

      if (!registerRes?.ok) return toast.error('Something went wrong');

      const userErrors = register?.userErrors;
      if (userErrors?.length) return handleError(userErrors);

      const customer = registerRes?.customer;
      if (customer?.id) {
        toast.success('You were successfully registered');
        dispatch({ type: actions.ADD_USER, payload: customer });
        push(config.routes.account);
      }

      return false;
    },
    [toggleLoading, handleError, push]
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

      const { customerUserErrors, customer } = data || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (customer?.id) {
        dispatch({ type: actions.ADD_USER, payload: customer });
        toast.success('Password correctly updated');
        push(config.routes.account);
      }

      return true;
    },
    [toggleLoading, handleError, push]
  );

  const handleRender = useCallback(async () => {
    console.log(
      '%c call generate delegate token and get customer',
      'color: red; font-size: 20px;'
    );

    await nextApiCall.generateDelegateToken();
    const response = await nextApiCall.getCustomer();
    if (response?.customer?.id) {
      dispatch({ type: actions.ADD_USER, payload: response.customer });
    }
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  const values = useMemo(
    () => ({
      // States
      user,
      loading,

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
