import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import config from '@/config/index';
import nextApiHelper from '@/helpers/api-next';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

import useCartContext from '../CartContext/useCartContext';
import { useToastContext } from '../ToastContext/NotificationContext';

import { actions, initialState, UserReducer } from './UserReducer';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { showToast } = useToastContext();
  const { updateCartBuyerIdentity, cart } = useCartContext();
  const { push, asPath } = useRouter();
  const { user, addresses, orders, ordersPageInfo, wishlist } = states || {};

  const setUser = useCallback(
    (payload) => payload?.id && dispatch({ payload, type: actions.ADD_USER }),
    []
  );

  const setUserWishlist = useCallback(
    (payload) => payload && dispatch({ payload, type: actions.ADD_USER_WISHLIST }),
    []
  );

  const isWishlist = useCallback(
    (product) => wishlist.some((item) => item.id === product.id),
    [wishlist]
  );

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
        ? wishlist.filter((production) => production.id !== product.id)
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

      if (response?.responseMetafield) {
        if (newWishList.length < wishlist.length) {
          showToast.success('Product correctly removed from wishlist');
        } else showToast.success('Product correctly added to wishlist');
        return setUserWishlist(response?.responseMetafield);
      }
      return showToast.error("Couldn't set product to user wishlist");
    },
    [asPath, isWishlist, push, setUserWishlist, showToast, user?.id, wishlist]
  );

  useEffect(() => {
    const getCustomer = async () => {
      if (user?.id) return;

      const customerAccessToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!customerAccessToken) {
        dispatch({ payload: undefined, type: actions.ADD_USER });
        return;
      }

      const userResponse = await getClient().storefront.customer.queryCustomer({
        customerAccessToken,
      });

      if (userResponse?.id) {
        setUser(userResponse);
        return;
      }
      push(config.routes.logout);
    };
    getCustomer();
  }, [user, showToast, setUser, push, dispatch]);

  useEffect(() => {
    const shopifyToken = handleGetTokenCookies(config.cookies.shopifyToken);
    if (shopifyToken && user?.id) updateCartBuyerIdentity(user, shopifyToken);
  }, [updateCartBuyerIdentity, user, cart]);

  const values = useMemo(
    () => ({
      addresses,
      dispatch,
      handleSetProductToWishList,
      isWishlist,
      orders,
      ordersPageInfo,
      setUserWishlist,
      user,
      wishlist,
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
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
