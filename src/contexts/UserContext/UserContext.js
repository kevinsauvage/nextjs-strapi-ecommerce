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
  const { updateCartBuyerIdentity } = useCartContext();
  const { push, asPath } = useRouter();
  const { user, addresses, orders, ordersPageInfo, wishlist, wishlistLoading } = states || {};

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

  const setWishlistLoading = useCallback((payload) => {
    if (payload) dispatch({ payload, type: actions.WISHLIST_LOADING });
  }, []);

  const getMetafields = useCallback(
    (product) => {
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
      return { metafields, newWishList };
    },
    [isWishlist, user?.id, wishlist]
  );

  const handleSetProductToWishList = useCallback(
    async (product) => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        return push({ pathname: config.routes.login, query: { redirectUrl: asPath } });
      }

      const { metafields, newWishList } = getMetafields(product);

      const response = await nextApiHelper('/api/wishlist', metafields, 'POST');

      if (response?.responseMetafield) {
        if (newWishList.length < wishlist.length) {
          showToast.success('Product correctly removed from wishlist');
        } else showToast.success('Product correctly added to wishlist');
        return setUserWishlist(response?.responseMetafield);
      }
      return showToast.error("Couldn't set product to user wishlist");
    },
    [asPath, getMetafields, push, setUserWishlist, showToast, wishlist?.length]
  );

  const getCustomer = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error(`Error get customer ${error}`);
    }
  }, [push, setUser, user?.id]);

  const getCustomerWishlist = useCallback(async () => {
    try {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        setUserWishlist([]);
        console.error('Missing shopify token to get customer wishlist');
        return;
      }

      setWishlistLoading(true);
      const wishlistResponse = await getClient().storefront.customer.queryCustomerMetafields({
        customerAccessToken: shopifyToken,
        metafields: [{ key: 'wishlist', namespace: 'custom' }],
      });
      setWishlistLoading(false);

      if (wishlistResponse?.length <= 0) {
        return;
      }
      const metafield = wishlistResponse.find((item) => item?.key === 'wishlist')?.value;
      const value = metafield && JSON.parse(metafield);
      if (value) setUserWishlist(Array.isArray(value) ? value : [value]);
    } catch (error) {
      console.error(`Error getting user wishlist ${error}`);
    }
  }, [setUserWishlist, setWishlistLoading]);

  const handleRenderUser = useCallback(async () => {
    const shopifyToken = handleGetTokenCookies(config.cookies.shopifyToken);
    if (shopifyToken && user?.id) updateCartBuyerIdentity(user, shopifyToken);
  }, [updateCartBuyerIdentity, user]);

  useEffect(() => {
    handleRenderUser();
  }, [handleRenderUser]);

  console.log('🚀 ~ file: UserContext.js:150 ~ useEffect ~ handleRenderUser:');

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  console.log('🚀 ~ file: UserContext.js:157 ~ useEffect ~ getCustomer:');

  useEffect(() => {
    getCustomerWishlist();
  }, [getCustomerWishlist]);

  console.log('🚀 ~ file: UserContext.js:164 ~ useEffect ~ getCustomerWishlist:');

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
      wishlistLoading,
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
      wishlistLoading,
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
