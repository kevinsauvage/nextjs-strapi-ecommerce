'use server';

import { CartService } from '@/services/cart.service';
import type { CartFieldsFragment } from '@/shopify/storefront';

export async function createCartAction(): Promise<CartFieldsFragment> {
  return CartService.createCart();
}
