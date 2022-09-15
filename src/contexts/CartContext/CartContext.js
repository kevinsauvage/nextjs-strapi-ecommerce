import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Client from 'shopify-buy';
import useLocalStorage from '@/hooks/useLocalStorage';
import { associateCustomerToCheckout } from '@/lib/shopify/customer';
import { toast } from 'react-toastify';
import { CartReducer, initialState, actions } from './CartReducer';
import { UserContext } from '../UserContext/UserContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const [checkoutId, setCheckoutId] = useLocalStorage('checkoutId', '');
  const { userAccessToken } = useContext(UserContext);

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

  const createCheckout = useCallback(async () => {
    if (states.client) {
      console.log('Creating Checkout');
      states.client.checkout.create().then((res) => {
        dispatch({ type: actions.CHECKOUT_FOUND, payload: res });
        setCheckoutId(res.id);
      });
    }
  }, [states.client]);

  useEffect(() => {
    if (!checkoutId) createCheckout();
  }, [createCheckout]);

  const getCheckoutById = useCallback(async () => {
    if (states.client) {
      console.log('getCheckoutById');

      await states.client.checkout.fetch(checkoutId).then((checkout) => {
        console.log(checkout, 'checkout fetched');
        if (checkout)
          dispatch({ type: actions.CHECKOUT_FOUND, payload: checkout });
      });
    }
  }, [states.client]);

  useEffect(() => {
    if (checkoutId && !states.checkout?.id) getCheckoutById();
  }, [states.client]);

  useEffect(() => {
    if (userAccessToken && checkoutId) {
      console.log('associateCustomerToCheckout');
      associateCustomerToCheckout(checkoutId, userAccessToken);
    }
  }, [userAccessToken, checkoutId]);

  const toggleLoading = useCallback(
    () => dispatch({ type: 'TOGGLE_CART_LOADING' }),
    []
  );

  const addToCart = useCallback(
    async (variantId, quantity) => {
      console.log(variantId);
      const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }];

      if (!states?.checkout?.id) await createCheckout();

      const id = states?.checkout?.id;

      states.client.checkout.addLineItems(id, lineItemsToAdd).then((res) => {
        dispatch({
          type: 'ADD_VARIANT_TO_CART',
          payload: { isCartOpen: true, checkout: res },
        });
        if (res) toast.success('Product correctly added.');
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

  console.log(states);

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
