import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import config from '@/config/index';
import { useRouter } from 'next/router';
import { UserReducer, initialState, actions } from './UserReducer';
import useCheckoutContext from '../CheckoutContext/useCheckoutContext';
import { useToastContext } from '../ToastContext/NotificationContext';
import useGlobalContext from '../GlobalContext/useGlobalContext';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders } = states || {};
  const { showToast } = useToastContext();
  const { toggleLoading } = useGlobalContext();
  const { handleSetCheckout } = useCheckoutContext();
  const { reload } = useRouter();

  const setUser = useCallback((payload) => {
    if (payload?.id) dispatch({ type: actions.ADD_USER, payload });
  }, []);

  const handleSetCheckoutShippingAddress = useCallback(
    async (customer) => {
      if (!customer?.id) return;
      const { defaultAddress } = customer || {};
      if (!defaultAddress) return;

      const whitelist = [
        'address1',
        'address2',
        'city',
        'country',
        'firstName',
        'lastName',
        'phone',
        'zip',
        'company',
        'province',
      ];

      const shippingAddress = Object.keys(defaultAddress)
        .filter((key) => whitelist.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: defaultAddress[key] }), {});

      const res = await nextApiCall.checkoutUpdateShippingAddress({ shippingAddress });
      if (res?.id) handleSetCheckout(res);
      else console.error("Couldn't associate default address to checkout res>>>", res);
    },
    [handleSetCheckout]
  );

  const logout = useCallback(async () => {
    toggleLoading(true);
    const res = await nextApiCall.logout();
    toggleLoading(false);
    if (res?.ok) return reload();
    return showToast.error(config.userFeedback.logout.error);
  }, [reload, showToast, toggleLoading]);

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return;
      const res = await nextApiCall.getCustomer();
      setUser(res?.customer);
      handleSetCheckoutShippingAddress(res?.customer);
      if (!res || !res.customer?.id) console.log('get customer failed');
    };
    getCustomer();
  }, [dispatch, user, handleSetCheckoutShippingAddress, showToast, logout, setUser]);

  const values = useMemo(
    () => ({
      user,
      addresses,
      orders,
      dispatch,
      logout,
    }),
    [user, dispatch, addresses, orders, logout]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
