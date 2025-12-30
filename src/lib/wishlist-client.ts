'use client';

import type { ProductFieldsFragment } from '@/shopify/storefront';
import { api } from '@/utils/apiClient';

type WishlistResponse = {
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: ProductFieldsFragment[];
};

/**
 * Add a product to wishlist by sending only the product ID
 */
export const addToWishlist = async (productId: string): Promise<WishlistResponse> => {
  return api.post<WishlistResponse>('/api/wishlist', { productId });
};

/**
 * Remove a product from wishlist by product ID
 */
export const removeFromWishlist = async (productId: string): Promise<WishlistResponse> => {
  const encodedProductId = encodeURIComponent(productId);
  return api.delete<WishlistResponse>(`/api/wishlist/${encodedProductId}`);
};
