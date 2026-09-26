'use server';

import { updateTag } from 'next/cache';

import config from '@/config';
import { getUserFeedback } from '@/data/userFeedback';
import { getCurrentLocale } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { fingerprintForRateLimit, getClientIp, rateLimitKey } from '@/lib/server/client-ip';
import { getBaseUrl } from '@/lib/server/metadata';
import { isRateLimited } from '@/lib/server/rate-limit';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { CartService } from '@/services/cart.service';
import {
  getWishlistIdsCached,
  isValidWishlistProductId,
  WISHLIST_MAX_ITEMS,
  WISHLIST_TAG,
  WishlistService,
} from '@/services/wishlist.service';
import type { CartFieldsFragment, ProductFieldsFragment } from '@/shopify/storefront';

export type WishlistActionResult = {
  success: boolean;
  data?: string[];
  message?: string;
};

/** Throttle wishlist writes, which each trigger an Admin API mutation. Fail closed, and key by IP plus the fingerprinted session token so off-Vercel `unknown`-IP traffic does not share one global bucket. */
const assertNotRateLimited = async (): Promise<boolean> => {
  const [ip, token] = await Promise.all([getClientIp(), getShopifyToken()]);
  return isRateLimited(
    'wishlist:write',
    rateLimitKey(ip, token ? fingerprintForRateLimit(token) : null),
    30,
    '1 m',
    { failClosed: true },
  );
};

/** Throttle wishlist reads, which each trigger a Storefront request. Fail open:
 * a limiter outage (or a tripped bucket) degrades to an empty list rather
 * than breaking the wishlist UI. Keyed like writes so off-Vercel `unknown`-IP
 * traffic does not share one global bucket. */
const assertReadsNotRateLimited = async (): Promise<boolean> => {
  const [ip, token] = await Promise.all([getClientIp(), getShopifyToken()]);
  return isRateLimited(
    'wishlist:read',
    rateLimitKey(ip, token ? fingerprintForRateLimit(token) : null),
    60,
    '1 m',
  );
};
/** Cap the client-supplied id list before any validation or fetching. */
const normalizeIds = (productIds: unknown): string[] =>
  Array.isArray(productIds) ? productIds.slice(0, WISHLIST_MAX_ITEMS) : [];

/** Max guest ids accepted by the login merge (guest list caps at 50 client-side). */
const MAX_GUEST_MERGE_IDS = 255;

/** Parse a raw guest id list, dropping junk, non-strings and duplicates. */
const normalizeGuestIds = (guestIds: unknown): string[] =>
  Array.isArray(guestIds)
    ? Array.from(
        new Set(
          guestIds
            .filter((id): id is string => typeof id === 'string')
            .filter(isValidWishlistProductId),
        ),
      ).slice(0, MAX_GUEST_MERGE_IDS)
    : [];

/** Parse a shared link's `ids` param: comma-separated, validated, deduped, capped. */
const parseSharedWishlistIds = (ids: unknown): string[] => {
  const raw = Array.isArray(ids) ? ids.join(',') : typeof ids === 'string' ? ids : '';

  return Array.from(
    new Set(
      raw
        .split(',')
        .map((id) => id.trim())
        .filter(isValidWishlistProductId),
    ),
  ).slice(0, WISHLIST_MAX_ITEMS);
};

/** Absolute read-only share URL carrying only product ids (no customer data). */
export async function createWishlistShareLinkAction(productIds: string[]): Promise<{
  success: boolean;
  url?: string;
  message?: string;
}> {
  const ids = normalizeIds(productIds)
    .filter(isValidWishlistProductId)
    .slice(0, WISHLIST_MAX_ITEMS);
  const feedback = getUserFeedback(await getCurrentLocale());

  if (ids.length === 0) {
    return { success: false, message: feedback.wishlist.empty };
  }

  if (await assertReadsNotRateLimited()) {
    return { success: false, message: feedback.rateLimit.wishlistRequests };
  }

  const path = `${config.routes.sharedWishlist}?ids=${ids.join(',')}`;

  // Absolute URL for the clipboard; the relative path is a safe fallback.
  try {
    return { success: true, url: `${getBaseUrl()}${path}` };
  } catch (error) {
    reportError('createWishlistShareLinkAction', error);
    return { success: true, url: path };
  }
}

export async function getWishlistIdsAction(): Promise<string[]> {
  if (await assertReadsNotRateLimited()) return [];

  try {
    return await getWishlistIdsCached();
  } catch (error) {
    reportError('getWishlistIdsAction', error);
    return [];
  }
}

export async function getWishlistProductsAction(
  productIds: string[],
): Promise<ProductFieldsFragment[]> {
  const ids = normalizeIds(productIds);
  if (ids.length === 0) return [];

  if (await assertReadsNotRateLimited()) return [];

  try {
    // `resolveProductsByIds` re-validates every id, so malformed input cannot
    // reach the Storefront API even though this action is unauthenticated.
    return await WishlistService.resolveProductsByIds(ids);
  } catch (error) {
    reportError('getWishlistProductsAction', error);
    return [];
  }
}

/**
 * Add or remove a product from the wishlist.
 *
 * @param isWishlisted whether the product is currently wishlisted:
 * `true` removes it, `false` adds it (mirrors `handleSetWishlist`).
 *
 * Membership and limit rules live in `WishlistService.mutateWishlist`, which
 * re-reads the list inside the customer lock; the only check kept here is the
 * cheap already-in-desired-state fast path that avoids a write entirely.
 */
export async function setWishlistMembershipAction(
  isWishlisted: boolean,
  productId: string,
): Promise<WishlistActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());

  if (!isValidWishlistProductId(productId)) {
    return { success: false, message: feedback.wishlist.invalidId };
  }

  if (await assertNotRateLimited()) {
    return { success: false, message: feedback.rateLimit.wishlist };
  }

  try {
    const { customerId, ids } = await WishlistService.getWishlistState();

    if (!customerId) {
      return { success: false, message: feedback.wishlist.unauthenticated };
    }

    if (isWishlisted ? !ids.includes(productId) : ids.includes(productId)) {
      return {
        success: true,
        data: ids,
        message: isWishlisted ? feedback.wishlist.alreadyRemoved : feedback.wishlist.alreadyAdded,
      };
    }

    // Re-read the current list and apply the change in a single write so a
    // concurrent add/remove is merged instead of being overwritten.
    const result = await WishlistService.mutateWishlist(
      { action: isWishlisted ? 'remove' : 'add', productId },
      customerId,
      feedback,
    );

    if (!result.success) {
      return { success: false, message: result.message || feedback.genericError };
    }

    // Read-your-own-writes: expire the cached ids so the header/UI reflect the change.
    updateTag(WISHLIST_TAG);

    return {
      success: true,
      data: result.data,
      message: isWishlisted ? feedback.wishlist.removed : feedback.wishlist.added,
    };
  } catch (error) {
    reportError('setWishlistMembershipAction', error);
    return { success: false, message: feedback.genericError };
  }
}

/**
 * Merge the device-local guest wishlist into the account (union, see
 * `mergeWishlistIds`) and return the resulting ids. Always reads the account
 * state, so a returning signed-in shopper with no guest list still loads their
 * server wishlist. The client clears its local copy after `success`.
 */
export async function mergeWishlistAction(guestIds: string[]): Promise<WishlistActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const ids = normalizeGuestIds(guestIds);

  if (await assertNotRateLimited()) {
    return { success: false, message: feedback.rateLimit.wishlist };
  }

  try {
    const { customerId } = await WishlistService.getWishlistState();

    if (!customerId) {
      return { success: false, message: feedback.wishlist.unauthenticated };
    }

    // An empty guest list makes this a plain read of the metafield (no write),
    // so a returning shopper still sees their saved items.
    const result = await WishlistService.mergeWishlist(ids, customerId, feedback);

    if (!result.success) {
      return { success: false, message: result.message || feedback.genericError };
    }

    // Only invalidate when something actually changed.
    if (result.merged) updateTag(WISHLIST_TAG);

    return {
      success: true,
      data: result.data,
      message: result.merged ? feedback.wishlist.merged : undefined,
    };
  } catch (error) {
    reportError('mergeWishlistAction', error);
    return { success: false, message: feedback.genericError };
  }
}

/** Product ids from a shared link. Public: works signed in or out. */
export async function getSharedWishlistProductsAction(
  ids: string[],
): Promise<ProductFieldsFragment[]> {
  const parsed = parseSharedWishlistIds(ids);
  if (parsed.length === 0) return [];

  if (await assertReadsNotRateLimited()) return [];

  try {
    return await WishlistService.resolveProductsByIds(parsed);
  } catch (error) {
    reportError('getSharedWishlistProductsAction', error);
    return [];
  }
}

/**
 * Add the wishlist's purchasable variants to the cart, then remove them from
 * the wishlist. Unavailable products stay saved and are counted in `message`.
 */
export async function moveWishlistToCartAction(productIds: string[]): Promise<{
  success: boolean;
  cart?: CartFieldsFragment;
  data?: string[];
  message?: string;
}> {
  const ids = normalizeIds(productIds).filter(isValidWishlistProductId);
  const feedback = getUserFeedback(await getCurrentLocale());

  if (ids.length === 0) {
    return { success: false, message: feedback.wishlist.invalidId };
  }

  if (await assertNotRateLimited()) {
    return { success: false, message: feedback.rateLimit.wishlist };
  }

  try {
    const { customerId } = await WishlistService.getWishlistState();

    if (!customerId) {
      return { success: false, message: feedback.wishlist.unauthenticated };
    }

    const resolution = await WishlistService.resolveMoveToCart(ids, feedback);

    if (!resolution.success || !resolution.lines || !resolution.movedProductIds) {
      return { success: false, message: resolution.message || feedback.genericError };
    }

    // Add to the cart *before* removing from the wishlist: if the cart write
    // fails, the products stay wishlisted instead of vanishing from both.
    const cart = await CartService.addLines(resolution.lines);

    const removal = await WishlistService.removeFromWishlist(
      resolution.movedProductIds,
      customerId,
      feedback,
    );

    if (!removal.success) {
      // The cart write succeeded, so report it as moved but surface the failed
      // cleanup rather than claiming the wishlist was emptied.
      reportError('moveWishlistToCartAction - wishlist cleanup', removal.message);
    }

    updateTag(WISHLIST_TAG);

    const count = resolution.movedProductIds.length;
    const skipped = resolution.skipped ?? 0;
    const unit = count === 1 ? feedback.wishlist.movedOne : feedback.wishlist.movedOther;

    return {
      success: true,
      cart,
      data: removal.success ? removal.data : undefined,
      message:
        skipped > 0
          ? (count === 1 ? feedback.wishlist.movedSkippedOne : feedback.wishlist.movedSkippedOther)
              .replace('{count}', String(count))
              .replace('{skipped}', String(skipped))
          : unit.replace('{count}', String(count)),
    };
  } catch (error) {
    reportError('moveWishlistToCartAction', error);
    return { success: false, message: feedback.genericError };
  }
}
