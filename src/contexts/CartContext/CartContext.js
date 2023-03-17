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

export const CartProvider = ({ children }) => {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const { cart, isLoading } = states;
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const handleSetCart = useCallback((payload) => dispatch({ payload, type: actions.ADD_CART }), []);
  const getTotalItems = useCallback(() => cart?.totalQuantity, [cart]);

  const removeFromCart = useCallback(
    async (lineItemId) => {
      if (!lineItemId) return console.error('Missing line item to delete');
      if (!cart?.id) return console.error('Missing cart id storage');

      toggleLoading(true);
      const removeLinesResponse = await getClient().storefront.cart.cartLinesRemove({
        cartId: cart?.id,
        lines: [lineItemId],
      });
      toggleLoading(false);

      const { cart: newCart, userErrors } = removeLinesResponse;

      if (newCart?.id) {
        showToast.success(userFeedback.removeLinesFromCart.success);
        return handleSetCart(newCart);
      }

      if (userErrors?.length) {
        return userErrors.forEach((error) => showToast.error(error));
      }

      return showToast.error(userFeedback.removeLinesFromCart.error);
    },
    [cart?.id, handleSetCart, showToast, toggleLoading]
  );

  const handleQuantityChange = useCallback(
    async (lines, successCallback) => {
      if (!lines) return console.error('Missing line items to update');
      if (!cart?.id) return console.error('Missing cart id ');

      toggleLoading(true);

      const updateLinesResponse = await getClient().storefront.cart.cartLinesUpdate({
        cartId: cart.id,
        lines,
      });

      const { cart: newCart, userErrors } = updateLinesResponse;

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

      if (!cartId) {
        console.error('Missing cart id storage');
        return;
      }

      if (!(quantity > 0 && variantId)) {
        return;
      }
      const lineItemsToAdd = [
        { merchandiseId: variantId, quantity: Number.parseInt(quantity, 10) },
      ];

      toggleLoading(true);
      const addLineResponse = await getClient().storefront.cart.cartLinesAdd({
        cartId,
        lines: lineItemsToAdd,
      });
      toggleLoading(false);

      const newCart = addLineResponse?.cart;
      const userErrors = addLineResponse?.userErrors;

      if (newCart?.id) {
        dispatch({ payload: newCart, type: actions.ADD_CART });
        showToast.success('Product added successfully');
        return;
      }

      if (userErrors?.length) {
        userErrors.forEach((error) => showToast.error(error));
        return;
      }

      showToast.error('Could not add the product variant to the cart');
    },
    [showToast, toggleLoading]
  );

  const updateCartBuyerIdentity = useCallback(
    async (customer, token) => {
      if (!cart?.id) return console.warn('Missing cart');
      if (!customer) return console.warn('Missing customer');
      if (!token) return console.warn('Missing token');
      if (cart?.buyerIdentity) return console.warn('Buyer identity already present');

      // TODO: ADD SHIPPING ADDRESS
      const buyerIdentity = {
        customerAccessToken: token,
        email: customer.email,
      };

      const updateResponse = await getClient().storefront.cart.cartBuyerIdentityUpdate({
        buyerIdentity,
        cartId: cart.id,
      });

      const newCart = updateResponse?.cart;

      if (newCart?.id) handleSetCart(newCart);
      return false;
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

      const createCartResponse = await getClient().storefront.cart.cartCreate({ input: {} });

      if (createCartResponse?.cart?.id) {
        window.localStorage.setItem(cartIdStorageKey, createCartResponse.cart.id);
        handleSetCart(createCartResponse);
      }
    };
    handleRender();
  }, [cart?.id, handleSetCart]);

  const values = useMemo(
    () => ({
      cart,
      dispatch,
      getTotalItems,
      handleAddToCart,
      handleQuantityChange,
      handleSetCart,
      isCartLoading: isLoading,
      removeFromCart,
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
};
