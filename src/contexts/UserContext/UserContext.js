import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';
import config from '@/config/index';
import { handleGetTokenCookies } from '@/helpers/cookies';
import { nextApiHelper } from '@/helpers/apiNext';
import getClient from '@/shopify/index';
import { UserReducer, initialState, actions } from './UserReducer';
import { useToastContext } from '../ToastContext/NotificationContext';
import useCartContext from '../CartContext/useCartContext';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [states, dispatch] = useReducer(UserReducer, initialState);
  const { user, addresses, orders, ordersPageInfo, wishlist } = states || {};
  const { showToast } = useToastContext();
  const { updateCartBuyerIdentity } = useCartContext();
  const { push, asPath } = useRouter();

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
        console.error('Missing shopify token to getCustomer');
        return dispatch({ type: actions.ADD_USER, payload: undefined });
      }

      const userRes = await getClient().storefront.customer.queryCustomer({
        customerAccessToken: shopifyToken,
      });

      if (userRes?.id) {
        setUser(userRes);
        return updateCartBuyerIdentity(userRes, shopifyToken);
      }
      return push(config.routes.logout);
    };
    getCustomer();
  }, [dispatch, user, showToast, setUser, push, updateCartBuyerIdentity, setUserWishlist]);

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

      const response = await nextApiHelper(`/api/wishlist`, metafields, 'POST');

      if (response?.response) {
        if (newWishList.length < wishlist.length) {
          showToast.success('Product correctly removed from wishlist');
        } else showToast.success('Product correctly added to wishlist');
        return setUserWishlist(response?.response);
      }
      return showToast.error("Couldn't set product to user wishlist");
    },
    [asPath, isWishlist, push, setUserWishlist, showToast, user?.id, wishlist]
  );

  const values = useMemo(
    () => ({
      user,
      addresses,
      orders,
      dispatch,
      ordersPageInfo,
      wishlist,
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
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
