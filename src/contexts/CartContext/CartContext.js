import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import config from '@/config/index';
import getClient from '@/shopify/index';
import { CartReducer, initialState, actions } from './CartReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import { useToastContext } from '../ToastContext/NotificationContext';

const {
  userFeedback,
  localStorageKeys: { cartIdStorageKey },
} = config;

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const { cart, isLoading } = states;
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const handleSetCart = useCallback((payload) => dispatch({ type: actions.ADD_CART, payload }), []);

  const removeFromCart = useCallback(
    async (lineItemId) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      const cartId = window.localStorage.getItem(cartIdStorageKey);

      if (!cartId) return console.error('Missing cart id storage');

      toggleLoading(true);
      const removeLinesRes = await getClient().cart.removeCartLines(cartId, [lineItemId]);
      const newCart = removeLinesRes?.cart;
      const userErrors = removeLinesRes?.userErrors;

      toggleLoading(false);

      if (newCart?.id) {
        showToast.success(userFeedback.removeLinesFromCart.success);
        return handleSetCart(newCart);
      }

      if (userErrors && userErrors.length) {
        return userErrors.forEach((error) => showToast.error(error));
      }

      return showToast.error(userFeedback.removeLinesFromCart.error);
    },
    [handleSetCart, showToast, toggleLoading]
  );

  const handleQuantityChange = useCallback(
    async (lineItems, successCallback) => {
      if (!lineItems) return console.error('Missing line items to update');

      const cartIdStorage = window.localStorage.getItem(cartIdStorageKey);
      if (!cartIdStorage) return console.error('Missing cart id storage');

      toggleLoading(true);

      const updateLinesRes = await getClient().cart.updateCartLines(cartIdStorage, lineItems);

      const newCart = updateLinesRes?.cart;
      const userErrors = updateLinesRes?.userErrors;

      toggleLoading(false);

      if (newCart?.id) {
        if (successCallback) successCallback();
        showToast.success(userFeedback.updateLines.success);
        return handleSetCart(newCart);
      }

      if (userErrors && userErrors.length) {
        return userErrors.forEach((error) => showToast.error(error));
      }
      return showToast.error(userFeedback.updateLines.error);
    },
    [handleSetCart, showToast, toggleLoading]
  );

  const handleAddToCart = useCallback(
    async (variantId, quantity) => {
      const cartId = window.localStorage.getItem(cartIdStorageKey);

      if (!cartId) return console.error('Missing cart id storage');

      if (quantity > 0 && variantId) {
        const lineItemsToAdd = [{ merchandiseId: variantId, quantity: parseInt(quantity, 10) }];

        toggleLoading(true);
        const addLineResponse = await getClient().cart.addCartLines(cartId, lineItemsToAdd);
        toggleLoading(false);

        const newCart = addLineResponse?.cart;
        const userErrors = addLineResponse?.userErrors;

        if (newCart?.id) {
          dispatch({ type: actions.ADD_CART, payload: addLineResponse });
          return showToast.success('Product added successfully');
        }

        if (userErrors && userErrors.length) {
          return userErrors.forEach((error) => showToast.error(error));
        }

        return showToast.error('Could not add the product variant to the cart');
      }
      return null;
    },
    [showToast, toggleLoading]
  );

  const getTotalItems = useCallback(() => cart?.totalQuantity || (0)[cart?.lines], [cart]);

  const updateCartBuyerIdentity = useCallback(
    async (customer, token) => {
      const cartId = window.localStorage.getItem(cartIdStorageKey);

      if (!cartId) return console.error('Missing cart id storage');
      if (!customer) return console.error('Missing customer');
      if (!token) return console.error('Missing token');

      // TODO: ADD SHIPPING ADDRESS
      const buyerInput = {
        customerAccessToken: token,
        email: customer.email,
      };

      const updateResponse = await getClient().cart.updateCartBuyerIdentity(buyerInput, cartId);

      const newCart = updateResponse?.cart;

      if (newCart?.id) {
        handleSetCart(newCart);
      }
      return null;
    },
    [handleSetCart]
  );

  useEffect(() => {
    const handleRender = async () => {
      if (!cart?.id) {
        const cartId = window.localStorage.getItem(cartIdStorageKey);

        if (cartId) {
          const getCartResponse = await getClient().cart.cartQuery(cartId);
          if (getCartResponse?.id) handleSetCart(getCartResponse);
          return;
        }

        if (!cartId) {
          const createCartRes = await getClient().cart.createCart({});

          if (createCartRes?.id) {
            window.localStorage.setItem(cartIdStorageKey, createCartRes.id);
            handleSetCart(createCartRes);
          }
        }
      }
    };
    handleRender();
  }, [cart?.id, handleSetCart]);

  const values = useMemo(
    () => ({
      cart,
      dispatch,
      isCartLoading: isLoading,
      removeFromCart,
      handleQuantityChange,
      handleSetCart,
      handleAddToCart,
      getTotalItems,
      updateCartBuyerIdentity,
    }),
    [
      cart,
      isLoading,
      removeFromCart,
      handleQuantityChange,
      updateCartBuyerIdentity,
      handleSetCart,
      handleAddToCart,
      getTotalItems,
    ]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
