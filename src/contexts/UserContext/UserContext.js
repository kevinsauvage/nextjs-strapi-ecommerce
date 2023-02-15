import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import config from '@/config/index';
import { getUser } from '@/lib/shopify/customer/customerApiCall';
import { updateCheckoutShippingAddress } from '@/lib/shopify/checkout/checkoutApiCall';
import { UserReducer, initialState, actions } from './UserReducer';
import useCheckoutContext from '../CheckoutContext/useCheckoutContext';
import { useToastContext } from '../ToastContext/NotificationContext';

export const UserContext = createContext();

const {
  localStorageKeys: { checkoutIdSorageKey },
} = config;

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders, ordersPageInfo } = states || {};
  const { showToast } = useToastContext();
  const { handleSetCheckout } = useCheckoutContext();

  const setUser = useCallback((payload) => {
    if (payload?.id) dispatch({ type: actions.ADD_USER, payload });
  }, []);

  const handleSetCheckoutShippingAddress = useCallback(
    async (customer) => {
      if (!customer?.id) return;
      const { defaultAddress } = customer || {};
      if (!defaultAddress) return;
      const checkoutIdStorage = window.localStorage.getItem(checkoutIdSorageKey);

      if (!checkoutIdStorage) {
        console.error('Missing checkout id storage');
        return;
      }

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

      const resUpdate = await updateCheckoutShippingAddress(shippingAddress, checkoutIdStorage);

      if (resUpdate?.id) handleSetCheckout(resUpdate);
      else console.error("Couldn't associate default address to checkout res>>>", resUpdate);
    },
    [handleSetCheckout]
  );

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return;
      const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);

      if (!shopifyToken) {
        console.error('Missing shopify token to getCustomer');
        return;
      }

      console.time('handleRender user context');

      const userRes = (await getUser(shopifyToken)) || {};
      const customer = userRes?.response?.customer;

      console.timeEnd('handleRender user context');
      if (customer?.id) {
        setUser(customer);
        handleSetCheckoutShippingAddress(customer);
        return;
      }
      console.error('no customer found in getCustomer()');
    };
    getCustomer();
  }, [dispatch, user, handleSetCheckoutShippingAddress, showToast, setUser]);

  const values = useMemo(
    () => ({
      user,
      addresses,
      orders,
      dispatch,
      ordersPageInfo,
    }),
    [user, addresses, orders, ordersPageInfo]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
