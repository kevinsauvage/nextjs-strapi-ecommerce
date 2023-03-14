import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import config from '@/config/index';
import { nextApiHelper } from '@/helpers/apiNext';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

import useCartContext from '../CartContext/useCartContext';
import { useToastContext } from '../ToastContext/NotificationContext';

import { actions, initialState, UserReducer } from './UserReducer';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { showToast } = useToastContext();
  const { updateCartBuyerIdentity, cart } = useCartContext();
  const { push, asPath } = useRouter();
  const { user, addresses, orders, ordersPageInfo, wishlist } = states || {};

  const setUser = useCallback((payload) => {
    if (payload?.id) dispatch({ type: actions.ADD_USER, payload });
  }, []);

  const setUserWishlist = useCallback((payload) => {
    if (payload) dispatch({ type: actions.ADD_USER_WISHLIST, payload });
  }, []);

  const isWishlist = useCallback((product) => wishlist.some((item) => item.id === product.id), [wishlist]);

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return null;

      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return dispatch({ type: actions.ADD_USER, payload: undefined });
      }

      const userRes = await getClient().storefront.customer.queryCustomer({
        customerAccessToken: shopifyToken,
      });

      if (userRes?.id) {
        return setUser(userRes);
      }
      return push(config.routes.logout);
    };
    getCustomer();
  }, [user, showToast, setUser, push, dispatch]);

  useEffect(() => {
    const shopifyToken = handleGetTokenCookies(config.cookies.shopifyToken);
    if (shopifyToken && user?.id) updateCartBuyerIdentity(user, shopifyToken);
  }, [updateCartBuyerIdentity, user, cart]);

  const handleSetProductToWishList = useCallback(
    async (product) => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return push({
          pathname: config.routes.login,
          query: { redirectUrl: asPath },
        });
      }

      const newWishList = isWishlist(product)
        ? wishlist.filter((prod) => prod.id !== product.id)
        : [...wishlist, product];

      const metafields = {
        metafields: [
          {
            key: 'wishlist',
            namespace: 'custom',
            ownerId: user.id,
            type: 'json',
            value: JSON.stringify(newWishList),
          },
        ],
      };

      const response = await nextApiHelper('/api/wishlist', metafields, 'POST');

      if (response?.response) {
        if (newWishList.length < wishlist.length) {
          showToast.success('Product correctly removed from wishlist');
        } else showToast.success('Product correctly added to wishlist');
        return setUserWishlist(response?.response);
      }
      return showToast.error('Couldn\'t set product to user wishlist');
    },
    [asPath, isWishlist, push, setUserWishlist, showToast, user?.id, wishlist],
  );

  const values = useMemo(
    () => ({
      user,
      addresses,
      orders,
      ordersPageInfo,
      wishlist,
      dispatch,
      isWishlist,
      handleSetProductToWishList,
      setUserWishlist,
    }),
    [
      user,
      addresses,
      orders,
      ordersPageInfo,
      wishlist,
      isWishlist,
      handleSetProductToWishList,
      setUserWishlist,
    ],
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
