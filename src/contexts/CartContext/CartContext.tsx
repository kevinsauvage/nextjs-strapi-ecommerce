'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  cartLinesAddAction,
  cartLinesRemoveAction,
  cartLinesUpdateAction,
} from '@/actions/cartActions';
import type { CartFieldsFragment } from '@/shopify/storefront';

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

export const CartProvider = ({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: CartFieldsFragment;
}) => {
  const [cart, setCart] = useState(initialCart);
  const parameters = useSearchParams();

  const handleResponse = useCallback(
    (response: { cart?: CartFieldsFragment; message?: string }) => {
      if (response.cart) {
        setCart(response.cart);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    [],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!lineItemId) return console.error('Missing line item to delete');

      const response = await cartLinesRemoveAction(
        lineItemId,
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after') || '',
        parameters.get('before') || '',
      );

      handleResponse(response);
    },
    [handleResponse, parameters],
  );

  const handleQuantityChange = useCallback(
    async (id: string, quantity: number) => {
      if (!id) return console.error('Missing line id to update');
      if (!quantity) return console.error('Missing quantity to update');

      const response = await cartLinesUpdateAction(
        [
          {
            id,
            quantity,
          },
        ],
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after') || '',
        parameters.get('before') || '',
      );

      handleResponse(response);
    },
    [handleResponse, parameters],
  );

  const handleAddToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!variantId) return console.error('Missing variant id to add');

      const lineItemsToAdd = [{ merchandiseId: variantId, quantity }];

      const response = await cartLinesAddAction(
        lineItemsToAdd,
        Number(parameters.get('first')),
        Number(parameters.get('last')),
        parameters.get('after') || '',
        parameters.get('before') || '',
      );

      handleResponse(response);
    },
    [handleResponse, parameters],
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
