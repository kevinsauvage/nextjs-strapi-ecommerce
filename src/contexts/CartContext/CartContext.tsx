'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { useSearchParams } from 'next/navigation';

import {
  cartLinesAddAction,
  cartLinesRemoveAction,
  cartLinesUpdateAction,
} from '@/actions/cartActions';

import { useToastContext } from '../ToastContext/NotificationContext';

export const CartContext = createContext({
  cart: {} as CartFieldsFragment,
  handleAddToCart: (_variantId: string, _quantity?: number) => {
    // noop
  },
  handleQuantityChange: (_id: string, _quantity: number) => {
    // noop
  },
  loading: false,
  removeFromCart: (_lineItemId: string) => {
    // noop
  },
});

export const CartProvider = ({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: CartFieldsFragment;
}) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(initialCart);
  const { showToast } = useToastContext();
  const parameters = useSearchParams();

  const handleResponse = useCallback(
    (response: { cart?: CartFieldsFragment; message?: string }) => {
      if (response.cart) {
        setCart(response.cart);
        showToast.success(response.message);
      } else {
        showToast.error(response.message);
      }
    },
    [showToast],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      setLoading(true);

      const response = await cartLinesRemoveAction(
        lineItemId,
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after'),
        parameters.get('before'),
      );

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse, parameters],
  );

  const handleQuantityChange = useCallback(
    async (id: string, quantity: number) => {
      if (!id) return console.error('Missing line id to update');
      if (!quantity) return console.error('Missing quantity to update');

      setLoading(true);

      const response = await cartLinesUpdateAction(
        [
          {
            id,
            quantity,
          },
        ],
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after'),
        parameters.get('before'),
      );

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse, parameters],
  );

  const handleAddToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!variantId) return console.error('Missing variant id to add');

      setLoading(true);

      const lineItemsToAdd = [{ merchandiseId: variantId, quantity }];

      const response = await cartLinesAddAction(
        lineItemsToAdd,
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after'),
        parameters.get('before'),
      );

      handleResponse(response);

      setLoading(false);
    },
    [handleResponse, parameters],
  );

  const values = useMemo(
    () => ({
      cart,
      handleAddToCart,
      handleQuantityChange,
      loading,
      removeFromCart,
    }),
    [cart, handleAddToCart, handleQuantityChange, removeFromCart, loading],
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
