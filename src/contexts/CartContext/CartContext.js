import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Client from 'shopify-buy';
import useLocalStorage from '@/hooks/useLocalStorage';
import { CartReducer, initialState, actions } from './CartReducer';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const [checkoutId, setCheckoutId] = useLocalStorage('checkoutId', '');

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
    if (states.client && !checkoutId) {
      states.client.checkout.create().then((res) => {
        dispatch({ type: actions.CHECKOUT_FOUND, payload: res });
        setCheckoutId(res.id);
      });
    }
  }, [states.client]);

  const getCheckoutById = useCallback(async () => {
    if (states.client && checkoutId) {
      await states.client.checkout.fetch(checkoutId).then((checkout) => {
        dispatch({ type: actions.CHECKOUT_FOUND, payload: checkout });
      });
    }
  }, [states.client]);

  useEffect(() => {
    if (states?.checkout && states?.checkout?.lineItems?.length < 1)
      getCheckoutById();
  }, [states.client]);

  const toggleLoading = useCallback(
    () => dispatch({ type: 'TOGGLE_CART_LOADING' }),
    []
  );

  const addToCart = useCallback(
    async (variantId, quantity) => {
      const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }];
      const { id } = states.checkout;

      states.client.checkout.addLineItems(id, lineItemsToAdd).then((res) => {
        dispatch({
          type: 'ADD_VARIANT_TO_CART',
          payload: { isCartOpen: true, checkout: res },
        });
      });
    },
    [states.client, states.checkout]
  );

  const removeFromCart = useCallback(
    (lineItemId) => {
      const { id } = states.checkout;
      toggleLoading();
      states.client.checkout.removeLineItems(id, [lineItemId]).then((res) => {
        dispatch({
          type: 'REMOVE_LINE_ITEM_IN_CART',
          payload: { checkout: res },
        });
      });
    },
    [states.client, states.checkout]
  );

  const handleQuantityChange = useCallback(
    (quantity, id) => {
      const checkId = states.checkout.id;
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      toggleLoading();
      states.client.checkout
        .updateLineItems(checkId, lineItemsToUpdate)
        .then((res) => {
          dispatch({
            type: 'UPDATE_QUANTITY_IN_CART',
            payload: { checkout: res },
          });
        });
    },
    [states.client, states.checkout]
  );

  const values = useMemo(
    () => ({
      // States
      cart: states.checkout,
      isCheckoutLoading: states.isCheckoutLoading,

      // Functions
      addToCart,
      removeFromCart,
      handleQuantityChange,
      getCheckoutById,
    }),
    [states]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
