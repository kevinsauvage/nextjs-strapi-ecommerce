import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import config from '@/config/index';
import getClient from '@/shopify/index';

import useGlobalContext from '../GlobalContext/useGlobalContext';
import { useToastContext } from '../ToastContext/NotificationContext';

import { actions, CartReducer, initialState } from './CartReducer';

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
      const removeLinesRes = await getClient().storefront.cart.cartLinesRemove({
        cartId,
        lines: [lineItemId],
      });
      const newCart = removeLinesRes?.cart;
      const userErrors = removeLinesRes?.userErrors;

      toggleLoading(false);

      if (newCart?.id) {
        showToast.success(userFeedback.removeLinesFromCart.success);
        return handleSetCart(newCart);
      }

      if (userErrors?.length) {
        return userErrors.forEach((error) => showToast.error(error));
      }

      return showToast.error(userFeedback.removeLinesFromCart.error);
    },
    [handleSetCart, showToast, toggleLoading]
  );

  const handleQuantityChange = useCallback(
    async (lineItems, successCallback) => {
      if (!lineItems) return console.error('Missing line items to update');
      if (!cart?.id) return console.error('Missing cart id ');

      toggleLoading(true);

      const updateLinesRes = await getClient().storefront.cart.cartLinesUpdate({
        cartId: cart.id,
        lines: lineItems,
      });

      const newCart = updateLinesRes?.cart;
      const userErrors = updateLinesRes?.userErrors;

      toggleLoading(false);

      if (newCart?.id) {
        if (successCallback) successCallback();
        showToast.success(userFeedback.updateLines.success);
        return handleSetCart(newCart);
      }

      if (userErrors?.length) {
        return userErrors.forEach((error) => showToast.error(error));
      }
      return showToast.error(userFeedback.updateLines.error);
    },
    [cart?.id, handleSetCart, showToast, toggleLoading]
  );

  const handleAddToCart = useCallback(
    async (variantId, quantity) => {
      const cartId = window.localStorage.getItem(cartIdStorageKey);

      if (!cartId) return console.error('Missing cart id storage');

      if (quantity > 0 && variantId) {
        const lineItemsToAdd = [{ merchandiseId: variantId, quantity: parseInt(quantity, 10) }];

        toggleLoading(true);
        const addLineResponse = await getClient().storefront.cart.cartLinesAdd({
          cartId,
          lines: lineItemsToAdd,
        });

        toggleLoading(false);

        const newCart = addLineResponse?.cart;
        const userErrors = addLineResponse?.userErrors;

        if (newCart?.id) {
          dispatch({ type: actions.ADD_CART, payload: newCart });
          return showToast.success('Product added successfully');
        }

        if (userErrors?.length) {
          return userErrors.forEach((error) => showToast.error(error));
        }

        return showToast.error('Could not add the product variant to the cart');
      }
      return null;
    },
    [showToast, toggleLoading]
  );

  const getTotalItems = useCallback(() => cart?.totalQuantity, [cart]);

  const updateCartBuyerIdentity = useCallback(
    async (customer, token) => {
      if (!cart?.id) return console.warn('Missing cart');
      if (!customer) return console.warn('Missing customer');
      if (!token) return console.warn('Missing token');
      if (cart?.buyerIdentity) return console.warn('Buyer identity already present');

      console.warn('updateCartBuyerIdentity call happening');

      // TODO: ADD SHIPPING ADDRESS
      const buyerInput = {
        customerAccessToken: token,
        email: customer.email,
      };

      const updateResponse = await getClient().storefront.cart.cartBuyerIdentityUpdate({
        buyerIdentity: buyerInput,
        cartId: cart.id,
      });

      const newCart = updateResponse?.cart;

      if (newCart?.id) {
        handleSetCart(newCart);
      }
      return null;
    },
    [cart?.buyerIdentity, cart?.id, handleSetCart]
  );

  useEffect(() => {
    const handleRender = async () => {
      if (cart?.id) return;
      const cartId = window.localStorage.getItem(cartIdStorageKey);

      if (cartId) {
        const getCartResponse = await getClient().storefront.cart.cartQuery({ cartId });

        if (getCartResponse?.id) handleSetCart(getCartResponse);
        return;
      }

      if (!cartId) {
        const createCartRes = await getClient().storefront.cart.cartCreate({ input: {} });

        if (createCartRes?.cart?.id) {
          window.localStorage.setItem(cartIdStorageKey, createCartRes.cart.id);
          handleSetCart(createCartRes);
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
