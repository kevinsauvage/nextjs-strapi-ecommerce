'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
  cartLinesAddAction,
  cartLinesRemoveAction,
  cartLinesUpdateAction,
} from '@/actions/cartActions';

import { useToastContext } from '../ToastContext/NotificationContext';

export const CartContext = createContext();

export const CartProvider = ({ children, initialCart }) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(initialCart);
  const { showToast } = useToastContext();

  const handleResponse = useCallback(
    (response) => {
      if (response?.success && response.cart) {
        setCart(response.cart);
        showToast.success(response.message);
      } else {
        showToast.error(response.message);
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    async (lineItemId) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      setLoading(true);

      const response = await cartLinesRemoveAction(lineItemId);

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse]
  );

  const handleQuantityChange = useCallback(
    async (id, quantity) => {
      if (!id) return console.error('Missing line id to update');
      if (!quantity) return console.error('Missing quantity to update');

      setLoading(true);

      const response = await cartLinesUpdateAction([
        {
          id,
          quantity,
        },
      ]);

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse]
  );

  const handleAddToCart = useCallback(
    async (variantId, quantity = 1) => {
      if (!variantId) return console.error('Missing variant id to add');

      setLoading(true);

      const lineItemsToAdd = [
        { merchandiseId: variantId, quantity: Number.parseInt(quantity, 10) },
      ];

      const response = await cartLinesAddAction(lineItemsToAdd);

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse]
  );

  const values = useMemo(
    () => ({
      cart,
      handleAddToCart,
      handleQuantityChange,
      loading,
      removeFromCart,
    }),
    [cart, handleAddToCart, handleQuantityChange, removeFromCart, loading]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
