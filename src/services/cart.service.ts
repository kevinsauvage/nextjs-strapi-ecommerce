import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import config from '@/config';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { mapShopifyUserErrors, safeLogError } from '@/utils/api-responses';
import { getSecureCookieOptions } from '@/utils/cookie-security';

/**
 * Cart service
 * Handles all cart-related business logic
 */
export class CartService {
  /**
   * Get cart by ID from Shopify
   */
  static async getCart(cartId: string): Promise<CartFieldsFragment | null> {
    try {
      const response = await storefrontSdk('no-store').getCart({
        cartId,
        ...adjustPaginationVariables({ first: 100 }),
      });

      return response?.cart || null;
    } catch (error) {
      safeLogError('CartService.getCart', error);
      return null;
    }
  }

  /**
   * Create a new cart in Shopify
   */
  static async createCart(): Promise<CartFieldsFragment> {
    const createCartResponse = await storefrontSdk('no-store').cartCreate({
      ...adjustPaginationVariables({ first: 100 }),
    });

    const { cart, userErrors, warnings } = createCartResponse.cartCreate || {};

    if (warnings && Array.isArray(warnings) && warnings?.length) {
      safeLogError('CartService.createCart - warnings', warnings);
    }

    const mappedUserErrors = mapShopifyUserErrors(userErrors);
    if (mappedUserErrors) {
      safeLogError('CartService.createCart - user errors', mappedUserErrors);
      if (!cart?.id) {
        throw new Error(
          mappedUserErrors[0]?.message || 'Failed to create cart due to validation errors',
        );
      }
    }

    if (!cart?.id) {
      throw new Error('Failed to create cart');
    }

    // Store cart ID in cookie
    const cookieStore = await cookies();
    cookieStore.set(config.cookies.cartId, cart.id, getSecureCookieOptions());

    // Revalidate cart page
    this.revalidate();

    return cart;
  }

  /**
   * Get or create cart
   * Returns existing cart if available, otherwise creates a new one
   */
  static async getOrCreateCart(): Promise<CartFieldsFragment> {
    const cartId = await this.getCartId();

    if (cartId) {
      const cart = await this.getCart(cartId);
      if (cart) {
        return cart;
      }
    }

    return this.createCart();
  }

  /**
   * Get cart by ID (alias for getCart)
   */
  static async getCartById(cartId: string): Promise<CartFieldsFragment | null> {
    return this.getCart(cartId);
  }

  /**
   * Get current cart ID from cookies
   */
  static async getCartId(): Promise<string | null> {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(config.cookies.cartId)?.value;
    return cartId || null;
  }

  /**
   * Revalidate cart cache
   */
  static revalidate(): void {
    revalidatePath(config.routes.cart);
  }
}

