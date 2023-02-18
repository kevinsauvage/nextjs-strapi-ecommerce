import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import config from '@/config/index';
import { useRouter } from 'next/router';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';
import { UserReducer, initialState, actions } from './UserReducer';
import { useToastContext } from '../ToastContext/NotificationContext';
import useCartContext from '../CartContext/useCartContext';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders, ordersPageInfo } = states || {};
  const { showToast } = useToastContext();
  const { updateCartBuyerIdentity } = useCartContext();
  const { push } = useRouter();

  const setUser = useCallback((payload) => {
    if (payload?.id) dispatch({ type: actions.ADD_USER, payload });
  }, []);

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return;

      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        console.error('Missing shopify token to getCustomer');
        return;
      }

      const userRes = (await getClient().customer.queryCustomer(shopifyToken)) || {};
      const customer = userRes?.response?.customer;

      if (customer?.id) {
        setUser(customer);

        updateCartBuyerIdentity(customer, shopifyToken);

        return;
      }
      push(config.routes.logout);
    };
    getCustomer();
  }, [dispatch, user, showToast, setUser, push, updateCartBuyerIdentity]);

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
