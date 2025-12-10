'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { CartFieldsFragment } from '@/shopify/storefront';
import { api } from '@/utils/apiClient';

export const CartContext = createContext({
  cart: {} as CartFieldsFragment,
  handleAddToCart: async (_variantId: string, _quantity?: number) => {
    // noop
  },
  handleQuantityChange: async (_id: string, _quantity: number) => {
    // noop
  },
  removeFromCart: async (_lineItemId: string) => {
    // noop
  },
});

const DEFAULT_CART_PAGINATION = {
  first: 100,
  last: 0,
  after: '',
  before: '',
};

export const CartProvider = ({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: CartFieldsFragment;
}) => {
  const [cart, setCart] = useState(initialCart);

  const handleResponse = useCallback((response: { data: CartFieldsFragment; message?: string }) => {
    setCart(response.data);
    if (response.message) {
      toast.success(response.message);
    }
  }, []);

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      try {
        const response = await api.delete<{ data: CartFieldsFragment; message: string }>(
          `/api/cart/lines?lineItemId=${encodeURIComponent(lineItemId)}&first=${DEFAULT_CART_PAGINATION.first}&last=${DEFAULT_CART_PAGINATION.last}&after=${DEFAULT_CART_PAGINATION.after}&before=${DEFAULT_CART_PAGINATION.before}`,
        );

        handleResponse(response);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to remove item');
      }
    },
    [handleResponse],
  );

  const handleQuantityChange = useCallback(
    async (id: string, quantity: number) => {
      if (!id) return console.error('Missing line id to update');
      if (!quantity) return console.error('Missing quantity to update');

      try {
        const response = await api.patch<{ data: CartFieldsFragment; message: string }>(
          `/api/cart/lines?first=${DEFAULT_CART_PAGINATION.first}&last=${DEFAULT_CART_PAGINATION.last}&after=${DEFAULT_CART_PAGINATION.after}&before=${DEFAULT_CART_PAGINATION.before}`,
          {
            lines: [{ id, quantity }],
            operation: 'update',
          },
        );

        handleResponse(response);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update cart');
      }
    },
    [handleResponse],
  );

  const handleAddToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!variantId) return console.error('Missing variant id to add');

      try {
        const response = await api.patch<{ data: CartFieldsFragment; message: string }>(
          `/api/cart/lines?first=${DEFAULT_CART_PAGINATION.first}&last=${DEFAULT_CART_PAGINATION.last}&after=${DEFAULT_CART_PAGINATION.after}&before=${DEFAULT_CART_PAGINATION.before}`,
          {
            addLines: [{ merchandiseId: variantId, quantity }],
            operation: 'add',
          },
        );

        handleResponse(response);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
      }
    },
    [handleResponse],
  );

  const values = useMemo(
    () => ({
      cart,
      handleAddToCart,
      handleQuantityChange,
      removeFromCart,
    }),
    [cart, handleAddToCart, handleQuantityChange, removeFromCart],
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
