import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import localStorageHelper from '@/helpers/localstorage';
import Client from 'shopify-buy';
import { CartReducer, initialState, actions } from './CartReducer';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const config = {
      storefrontAccessToken:
        process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
      domain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN,
      language: router.locale,
    };

    const client = Client.buildClient(config);

    dispatch({ type: 'CLIENT_CREATED', payload: client });
  }, []);

  useEffect(() => {
    if (states.client && !localStorageHelper.load('checkoutId')) {
      states.client.checkout.create().then((res) => {
        console.log(res);
        dispatch({ type: actions.CHECKOUT_FOUND, payload: res });
        localStorageHelper.store('checkoutId', res.id);
      });
    }
  }, [states.client]);

  const getCheckoutById = async () => {
    if (states.client && localStorageHelper.load('checkoutId')) {
      await states.client.checkout
        .fetch(localStorageHelper.load('checkoutId'))
        .then((checkout) => {
          dispatch({ type: actions.CHECKOUT_FOUND, payload: checkout });
        });
    }
  };

  useEffect(() => {
    getCheckoutById();
  }, [states.client]);

  const toggleLoading = () => {
    dispatch({ type: 'TOGGLE_CART_LOADING' });
  };

  const values = useMemo(
    () => ({
      cart: states.checkout,
      isCheckoutLoading: states.isCheckoutLoading,

      addToCart: async (variantId, quantity) => {
        const lineItemsToAdd = [
          { variantId, quantity: parseInt(quantity, 10) },
        ];
        const checkoutId = states.checkout.id;
        states.client.checkout
          .addLineItems(checkoutId, lineItemsToAdd)
          .then((res) => {
            dispatch({
              type: 'ADD_VARIANT_TO_CART',
              payload: { isCartOpen: true, checkout: res },
            });
          });
      },

      removeFromCart: (lineItemId) => {
        const checkoutId = states.checkout.id;
        toggleLoading();
        states.client.checkout
          .removeLineItems(checkoutId, [lineItemId])
          .then((res) => {
            dispatch({
              type: 'REMOVE_LINE_ITEM_IN_CART',
              payload: { checkout: res },
            });
          });
      },

      handleQuantityChange: (quantity, id) => {
        const checkoutId = states.checkout.id;
        const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
        toggleLoading();
        states.client.checkout
          .updateLineItems(checkoutId, lineItemsToUpdate)
          .then((res) => {
            dispatch({
              type: 'UPDATE_QUANTITY_IN_CART',
              payload: { checkout: res },
            });
          });
      },

      getCheckoutById,
    }),
    [states]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
