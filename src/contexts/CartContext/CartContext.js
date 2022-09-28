import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';
import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { CartReducer, initialState, actions } from './CartReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import useUserContext from '../UserContext/useUserContext';

export const CartContext = createContext();

export function CartProvider({ children, client }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const [checkoutId, setCheckoutId] = useLocalStorage('checkoutId', '');
  const { userAccessToken } = useUserContext();
  const { toggleCart } = useGlobalContext();

  const createCheckout = useCallback(async () => {
    client.checkout.create().then((res) => {
      dispatch({ type: actions.CHECKOUT_FOUND, payload: res });
      setCheckoutId(res.id);
    });
  }, [client, setCheckoutId]);

  useEffect(() => {
    if (!checkoutId) createCheckout();
  }, [createCheckout, checkoutId]);

  const getCheckoutById = useCallback(
    async (id) => {
      await client.checkout.fetch(id).then((checkout) => {
        if (checkout)
          dispatch({ type: actions.CHECKOUT_FOUND, payload: checkout });
      });
    },
    [client]
  );

  useEffect(() => {
    if (checkoutId && !states.checkout?.id) getCheckoutById(checkoutId);
  }, [checkoutId, getCheckoutById, states.checkout.id]);

  useEffect(() => {
    if (userAccessToken && checkoutId) {
      associateCustomerToCheckout(checkoutId, userAccessToken);
    }
  }, [userAccessToken, checkoutId]);

  const toggleLoading = useCallback(
    () => dispatch({ type: 'TOGGLE_CART_LOADING' }),
    []
  );

  const addToCart = useCallback(
    async (variantId, quantity) => {
      const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }];

      if (!states?.checkout?.id) await createCheckout();

      const id = states?.checkout?.id;

      client.checkout.addLineItems(id, lineItemsToAdd).then((res) => {
        dispatch({
          type: 'ADD_VARIANT_TO_CART',
          payload: { isCartOpen: true, checkout: res },
        });
        if (res) toggleCart(true);
        else toast.error('Product not added. Try again later.');
      });
    },
    [client, states.checkout, createCheckout, toggleCart]
  );

  const removeFromCart = useCallback(
    (lineItemId) => {
      const { id } = states.checkout;
      toggleLoading();
      client.checkout.removeLineItems(id, [lineItemId]).then((res) => {
        dispatch({
          type: 'REMOVE_LINE_ITEM_IN_CART',
          payload: { checkout: res },
        });
      });
    },
    [client, states.checkout, toggleLoading]
  );

  const handleQuantityChange = useCallback(
    (quantity, id) => {
      const checkId = states.checkout.id;
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      toggleLoading();
      client.checkout
        .updateLineItems(checkId, lineItemsToUpdate)
        .then((res) => {
          dispatch({
            type: 'UPDATE_QUANTITY_IN_CART',
            payload: { checkout: res },
          });
        });
    },
    [client, states.checkout, toggleLoading]
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
    }),
    [states, addToCart, removeFromCart, handleQuantityChange]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
