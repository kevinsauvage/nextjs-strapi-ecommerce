'use client';

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  addCartDeliveryAddressAction,
  addCartLinesAction,
  type DeliveryAddressInput,
  getCartAction,
  removeCartDeliveryAddressAction,
  removeCartLineAction,
  removeGiftCardCodeAction,
  selectCartDeliveryOptionAction,
  updateCartAttributesAction,
  updateCartDeliveryPreferenceAction,
  updateCartLinesAction,
  updateCartNoteAction,
  updateDiscountCodesAction,
  updateGiftCardCodesAction,
} from '@/actions/cartActions';
import { useRenderedLocale } from '@/components/LocaleProvider';
import config from '@/config';
import { getUserFeedback } from '@/data/userFeedback';
import { getCookieFront } from '@/lib/client/cookies';
import { reportError } from '@/lib/logger';
import type {
  CartDeliveryPreferenceInput,
  CartFieldsFragment,
  CartSelectedDeliveryOptionInput,
} from '@/shopify/storefront';

import { toast } from 'sonner';

type CartResponse = { data: CartFieldsFragment; message?: string };

interface CartContextType {
  cart: CartFieldsFragment | null;
  error: string | null;
  isLoading: boolean;
  handleAddToCart: (variantId: string, quantity?: number) => Promise<void>;
  handleQuantityChange: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  removeGiftCardCode: (appliedGiftCardId: string) => Promise<void>;
  setCart: (cart: CartFieldsFragment) => void;
  updateAttributes: (attributes: Array<{ key: string; value: string }>) => Promise<void>;
  updateDeliveryAddress: (address: DeliveryAddressInput) => Promise<void>;
  updateDeliveryPreference: (preference: CartDeliveryPreferenceInput) => Promise<void>;
  updateDiscountCodes: (discountCodes: string[]) => Promise<void>;
  updateGiftCardCodes: (giftCardCodes: string[]) => Promise<void>;
  updateNote: (note: string) => Promise<void>;
  updateSelectedDeliveryOption: (
    selectedDeliveryOptions: CartSelectedDeliveryOptionInput[],
  ) => Promise<void>;
  removeDeliveryAddress: (addressId: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  error: null,
  isLoading: true,
  handleAddToCart: async () => {},
  handleQuantityChange: async () => {},
  removeFromCart: async () => {},
  removeDeliveryAddress: async () => {},
  removeGiftCardCode: async () => {},
  setCart: () => {},
  updateAttributes: async () => {},
  updateDeliveryAddress: async () => {},
  updateDeliveryPreference: async () => {},
  updateDiscountCodes: async () => {},
  updateGiftCardCodes: async () => {},
  updateNote: async () => {},
  updateSelectedDeliveryOption: async () => {},
});

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  return error instanceof Error ? error.message : defaultMessage;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const feedback = getUserFeedback(useRenderedLocale());
  // Stable string for the mount-only hydration effect below.
  const cartLoadFailed = feedback.client.cartLoadFailed;
  const [cart, setCartState] = useState<CartFieldsFragment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Monotonic id so concurrent mutations cannot resolve out of order: only
  // the latest response may write the cart; stale ones are dropped. (The
  // same pattern already guards predictive search in `Search.tsx`.)
  const requestIdRef = useRef(0);

  // The cart id lives in an httpOnly cookie, so the cart is hydrated client-side
  // to keep the root layout (and the catalog) statically renderable. A cart is
  // created on demand by the first mutation, never here.
  useEffect(() => {
    let cancelled = false;

    // No readable marker → no cookie-backed cart exists yet, so skip the
    // server-action round-trip entirely on a first visit.
    const hasCart = Boolean(getCookieFront(config.cookies.cartPresent));

    (hasCart ? getCartAction() : Promise.resolve(null))
      .then((initialCart) => {
        if (!cancelled) setCartState(initialCart);
      })
      .catch((loadError) => {
        if (cancelled) return;
        const message = getErrorMessage(loadError, cartLoadFailed);
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cartLoadFailed]);

  const handleResponse = useCallback((requestId: number, response: CartResponse) => {
    if (requestId !== requestIdRef.current) return;
    setCartState(response.data);
    setError(null);
    if (response.message) {
      toast.success(response.message);
    }
  }, []);

  const handleMutationError = useCallback(
    (requestId: number, context: string, caughtError: unknown, fallbackMessage: string) => {
      if (requestId !== requestIdRef.current) return;
      reportError(context, caughtError);
      toast.error(getErrorMessage(caughtError, fallbackMessage));
    },
    [],
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!lineItemId) {
        reportError('cart/remove', new Error('Missing line item ID'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await removeCartLineAction(lineItemId);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(requestId, 'cart/remove', caughtError, feedback.cart.fallbackRemove);
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const removeGiftCardCode = useCallback(
    async (appliedGiftCardId: string) => {
      if (!appliedGiftCardId) {
        reportError('cart/gift-card-remove', new Error('Missing gift card ID'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await removeGiftCardCodeAction(appliedGiftCardId);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/gift-card-remove',
          caughtError,
          'Failed to remove gift card',
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const handleQuantityChange = useCallback(
    async (id: string, quantity: number) => {
      if (!id || !quantity) {
        reportError('cart/quantity', new Error('Missing required parameters: id or quantity'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateCartLinesAction([{ id, quantity }]);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/quantity',
          caughtError,
          feedback.cart.fallbackQuantity,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const handleAddToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!variantId) {
        reportError('cart/add', new Error('Missing variant ID'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await addCartLinesAction([{ merchandiseId: variantId, quantity }]);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(requestId, 'cart/add', caughtError, feedback.cart.fallbackAdd);
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateDiscountCodes = useCallback(
    async (discountCodes: string[]) => {
      if (!Array.isArray(discountCodes)) {
        reportError('cart/discount', new Error('Invalid discount codes format'));
        return;
      }

      const validCodes = discountCodes
        .map((code) => String(code).trim())
        .filter((code) => code.length > 0);

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateDiscountCodesAction(validCodes);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/discount',
          caughtError,
          feedback.cart.fallbackDiscount,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateGiftCardCodes = useCallback(
    async (giftCardCodes: string[]) => {
      if (!Array.isArray(giftCardCodes)) {
        reportError('cart/gift-card', new Error('Invalid gift card codes format'));
        return;
      }

      const validCodes = giftCardCodes
        .map((code) => String(code).trim())
        .filter((code) => code.length > 0);

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateGiftCardCodesAction(validCodes);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/gift-card',
          caughtError,
          feedback.cart.fallbackGiftCard,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateNote = useCallback(
    async (note: string) => {
      if (typeof note !== 'string') {
        reportError('cart/note', new Error('Invalid order note format'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateCartNoteAction(note);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(requestId, 'cart/note', caughtError, feedback.cart.fallbackNote);
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateAttributes = useCallback(
    async (attributes: Array<{ key: string; value: string }>) => {
      if (!Array.isArray(attributes)) {
        reportError('cart/attributes', new Error('Invalid cart attributes format'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateCartAttributesAction(attributes);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/attributes',
          caughtError,
          feedback.cart.fallbackAttributes,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateDeliveryAddress = useCallback(
    async (address: DeliveryAddressInput) => {
      if (!address) {
        reportError('cart/delivery-address', new Error('Missing delivery address'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await addCartDeliveryAddressAction(address);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/delivery-address',
          caughtError,
          feedback.cart.fallbackEstimate,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const removeDeliveryAddress = useCallback(
    async (addressId: string) => {
      if (!addressId) {
        reportError('cart/delivery-address-remove', new Error('Missing delivery address ID'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await removeCartDeliveryAddressAction(addressId);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/delivery-address-remove',
          caughtError,
          feedback.cart.fallbackClearEstimate,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateSelectedDeliveryOption = useCallback(
    async (selectedDeliveryOptions: CartSelectedDeliveryOptionInput[]) => {
      if (!Array.isArray(selectedDeliveryOptions) || selectedDeliveryOptions.length === 0) {
        reportError('cart/delivery-option', new Error('Missing delivery option'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await selectCartDeliveryOptionAction(selectedDeliveryOptions);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/delivery-option',
          caughtError,
          feedback.cart.fallbackMethod,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  const updateDeliveryPreference = useCallback(
    async (preference: CartDeliveryPreferenceInput) => {
      if (!preference) {
        reportError('cart/delivery-preference', new Error('Missing delivery preference'));
        return;
      }

      const requestId = (requestIdRef.current += 1);
      try {
        const response = await updateCartDeliveryPreferenceAction(preference);
        handleResponse(requestId, response);
      } catch (caughtError) {
        handleMutationError(
          requestId,
          'cart/delivery-preference',
          caughtError,
          feedback.cart.fallbackPreference,
        );
      }
    },
    [feedback, handleMutationError, handleResponse],
  );

  // Adopt a cart returned by a mutation outside this context (move-to-cart).
  const setCart = useCallback((nextCart: CartFieldsFragment) => {
    setCartState(nextCart);
    setError(null);
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      error,
      isLoading,
      handleAddToCart,
      handleQuantityChange,
      removeDeliveryAddress,
      removeFromCart,
      removeGiftCardCode,
      setCart,
      updateAttributes,
      updateDeliveryAddress,
      updateDeliveryPreference,
      updateDiscountCodes,
      updateGiftCardCodes,
      updateNote,
      updateSelectedDeliveryOption,
    }),
    [
      cart,
      error,
      isLoading,
      handleAddToCart,
      handleQuantityChange,
      removeDeliveryAddress,
      removeFromCart,
      removeGiftCardCode,
      setCart,
      updateAttributes,
      updateDeliveryAddress,
      updateDeliveryPreference,
      updateDiscountCodes,
      updateGiftCardCodes,
      updateNote,
      updateSelectedDeliveryOption,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
