'use client';

import type { ProductFieldsFragment } from '@/shopify/storefront';
import { api } from '@/utils/apiClient';

type WishlistResponse = {
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: ProductFieldsFragment[];
};

export const addToWishlist = async (product: ProductFieldsFragment): Promise<WishlistResponse> => {
  return api.post<WishlistResponse>('/api/wishlist', { product });
};

export const removeFromWishlist = async (productId: string): Promise<WishlistResponse> => {
  const encodedProductId = encodeURIComponent(productId);
  return api.delete<WishlistResponse>(`/api/wishlist/${encodedProductId}`);
};
