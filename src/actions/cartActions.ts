'use server';

import { getUserFeedback, type UserFeedback } from '@/data/userFeedback';
import { getCurrentLocale } from '@/i18n/server';
import { getOrderById } from '@/lib/server/account';
import { getClientIp, rateLimitKey } from '@/lib/server/client-ip';
import { isRateLimited } from '@/lib/server/rate-limit';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { CartService } from '@/services/cart.service';
import type {
  CartDeliveryPreferenceInput,
  CartFieldsFragment,
  CartLineInput,
  CartLineUpdateInput,
  CartSelectableAddressUpdateInput,
  CartSelectedDeliveryOptionInput,
  CountryCode,
} from '@/shopify/storefront';
import { companyField, phoneField, shopifyGidField } from '@/utils/validation';

import { z } from 'zod';

export type CartActionResult = {
  data: CartFieldsFragment;
  message?: string;
};

const MAX_LINES_PER_REQUEST = 50;
const MAX_QUANTITY = 99;
const MAX_DISCOUNT_CODES = 20;

const quantitySchema = z.number().int().min(1).max(MAX_QUANTITY);

const addLinesSchema = z
  .array(
    z.object({
      merchandiseId: shopifyGidField,
      quantity: quantitySchema,
    }),
  )
  .min(1)
  .max(MAX_LINES_PER_REQUEST);

const updateLinesSchema = z
  .array(
    z.object({
      id: shopifyGidField,
      quantity: quantitySchema,
    }),
  )
  .min(1)
  .max(MAX_LINES_PER_REQUEST);

const lineIdSchema = shopifyGidField;

const discountCodesSchema = z.array(z.string().trim().min(1).max(64)).max(MAX_DISCOUNT_CODES);

const giftCardCodesSchema = z.array(z.string().trim().min(1).max(64)).max(MAX_DISCOUNT_CODES);

const cartNoteSchema = z.string().trim().max(2000);

const MAX_ATTRIBUTES = 10;

const cartAttributesSchema = z
  .array(
    z.object({
      key: z.string().trim().min(1).max(64),
      value: z.string().trim().max(1024),
    }),
  )
  .max(MAX_ATTRIBUTES);

/** Throttle public cart writes per client IP (plus cart id when known). Fail closed: cart writes burn Storefront quota, so an Upstash outage must deny writes rather than allow unlimited mutations. */
const assertNotRateLimited = async (feedback: UserFeedback): Promise<void> => {
  const [ip, cartId] = await Promise.all([getClientIp(), CartService.getCartId()]);
  if (
    await isRateLimited('cart:write', rateLimitKey(ip, cartId), 60, '1 m', { failClosed: true })
  ) {
    throw new Error(feedback.cart.rateLimited);
  }
};

/**
 * Read the current cart for client-side hydration. Returns `null` only when
 * there is no cart yet. Transient/network failures throw so the UI can surface
 * the outage instead of showing a silently empty cart.
 */
export async function getCartAction(): Promise<CartFieldsFragment | null> {
  const cartId = await CartService.getCartId();

  if (!cartId) return null;

  return CartService.getCart(cartId);
}

export async function addCartLinesAction(lines: CartLineInput[]): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = addLinesSchema.safeParse(lines);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidItem);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.addLines(parsed.data);
  return { data: cart, message: feedback.cart.addSuccess };
}

export async function updateCartLinesAction(
  lines: CartLineUpdateInput[],
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = updateLinesSchema.safeParse(lines);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidUpdate);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateLines(parsed.data);
  return { data: cart, message: feedback.cart.updateSuccess };
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = lineIdSchema.safeParse(lineId);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidLine);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.removeLine(parsed.data);
  return { data: cart, message: feedback.cart.removeSuccess };
}

export async function updateDiscountCodesAction(
  discountCodes: string[],
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = discountCodesSchema.safeParse(discountCodes);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDiscount);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateDiscountCodes(parsed.data);
  return { data: cart, message: feedback.cart.discountSuccess };
}

export async function updateGiftCardCodesAction(
  giftCardCodes: string[],
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = giftCardCodesSchema.safeParse(giftCardCodes);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidGiftCardCode);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateGiftCardCodes(parsed.data);

  // Shopify silently ignores unrecognized codes (no userErrors, nothing
  // applied), so an empty applied list after sending codes means the code
  // was not recognized — surface it instead of reporting success.
  if (parsed.data.length > 0 && cart.appliedGiftCards.length === 0) {
    throw new Error(feedback.cart.unrecognizedGiftCard);
  }

  return { data: cart, message: feedback.cart.giftCardsSuccess };
}

const appliedGiftCardIdSchema = shopifyGidField;

export async function removeGiftCardCodeAction(
  appliedGiftCardId: string,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = appliedGiftCardIdSchema.safeParse(appliedGiftCardId);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidGiftCard);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.removeGiftCardCode(parsed.data);
  return { data: cart, message: feedback.cart.giftCardRemoved };
}

export async function updateCartNoteAction(note: string): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = cartNoteSchema.safeParse(note);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidNote);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateNote(parsed.data);
  return { data: cart, message: feedback.cart.noteSaved };
}

export async function updateCartAttributesAction(
  attributes: Array<{ key: string; value: string }>,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = cartAttributesSchema.safeParse(attributes);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidAttributes);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateAttributes(parsed.data);
  return { data: cart, message: feedback.cart.updateSuccess };
}

const MAX_DELIVERY_GROUPS = 10;

/**
 * Delivery address as the client submits it. `countryCode` stays a plain string
 * until `countryCodeField` narrows it to Shopify's generated `CountryCode`
 * union, so callers never have to cast.
 */
export type DeliveryAddressInput = {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  countryCode: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  provinceCode?: string;
  zip: string;
};

/**
 * Shopify's `CountryCode` is a schema-generated string union with no runtime
 * enum (`enumsAsTypes`), so it cannot be parsed by value. Two ASCII letters is
 * the documented shape; validate that and take the union at this single
 * boundary — the same "one assertion point" approach as `normalizeMenuHref`'s
 * `as Route`.
 */
const countryCodeField = (feedback: UserFeedback) =>
  z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, feedback.cart.invalidCountry)
    .transform((code) => code.toUpperCase() as CountryCode);

const getDeliveryAddressSchema = (feedback: UserFeedback) =>
  z.object({
    address1: z.string().trim().max(255).optional(),
    address2: z.string().trim().max(255).optional(),
    city: z.string().trim().max(255).optional(),
    company: companyField,
    countryCode: countryCodeField(feedback),
    firstName: z.string().trim().max(100).optional(),
    lastName: z.string().trim().max(100).optional(),
    phone: phoneField,
    provinceCode: z.string().trim().max(3).optional(),
    zip: z.string().trim().min(1).max(20),
  });

/** Attach the delivery address Shopify prices the cart against (shipping/pickup). */
export async function addCartDeliveryAddressAction(
  address: DeliveryAddressInput,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = getDeliveryAddressSchema(feedback).safeParse(address);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDeliveryAddress);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.addDeliveryAddress(parsed.data);
  return { data: cart, message: feedback.cart.estimateUpdated };
}

const getSelectableAddressUpdateSchema = (feedback: UserFeedback) =>
  z.object({
    address: z.object({ deliveryAddress: getDeliveryAddressSchema(feedback) }).optional(),
    id: shopifyGidField,
    oneTimeUse: z.boolean().optional(),
    selected: z.boolean().optional(),
  });

/** Update an existing selectable delivery address (id required). */
export async function updateCartDeliveryAddressAction(
  address: CartSelectableAddressUpdateInput,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = getSelectableAddressUpdateSchema(feedback).safeParse(address);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDeliveryAddress);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateDeliveryAddress(parsed.data);
  return { data: cart, message: feedback.cart.addressUpdated };
}

/** Detach a selectable delivery address by its cart-scoped id. */
export async function removeCartDeliveryAddressAction(
  addressId: string,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = shopifyGidField.safeParse(addressId);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDeliveryAddress);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.removeDeliveryAddress(parsed.data);
  return { data: cart, message: feedback.cart.addressRemoved };
}

const selectedDeliveryOptionsSchema = z
  .array(
    z.object({
      deliveryGroupId: shopifyGidField,
      deliveryOptionHandle: z.string().trim().min(1).max(255),
    }),
  )
  .min(1)
  .max(MAX_DELIVERY_GROUPS);

/** Choose the shipping or pickup option for one or more delivery groups. */
export async function selectCartDeliveryOptionAction(
  selectedDeliveryOptions: CartSelectedDeliveryOptionInput[],
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = selectedDeliveryOptionsSchema.safeParse(selectedDeliveryOptions);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDeliveryOption);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.selectDeliveryOptions(parsed.data);
  return { data: cart, message: feedback.cart.methodUpdated };
}

const deliveryPreferenceSchema = z.object({
  deliveryMethod: z
    .array(z.enum(['PICKUP_POINT', 'PICK_UP', 'SHIPPING']))
    .max(3)
    .optional(),
  pickupHandle: z.array(z.string().trim().min(1).max(255)).max(20).optional(),
});

/** Pre-fill the buyer's preferred delivery method and pickup location. */
export async function updateCartDeliveryPreferenceAction(
  preference: CartDeliveryPreferenceInput,
): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = deliveryPreferenceSchema.safeParse(preference);
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidDeliveryPreference);
  }

  await assertNotRateLimited(feedback);

  const cart = await CartService.updateDeliveryPreference(parsed.data);
  return { data: cart, message: feedback.cart.preferenceSaved };
}

const getReorderSchema = (feedback: UserFeedback) =>
  z.object({
    orderId: z.string().trim().regex(/^\d+$/, feedback.cart.invalidOrder).max(20),
  });

/**
 * Re-add every currently purchasable line of a past order to the cart.
 * Requires the customer session (orders are customer-scoped), so guests are
 * asked to sign in. Variants that no longer exist or are not for sale are
 * skipped and reported in the returned message.
 */
export async function reorderAction(orderId: string): Promise<CartActionResult> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const parsed = getReorderSchema(feedback).safeParse({ orderId });
  if (!parsed.success) {
    throw new Error(feedback.cart.invalidOrder);
  }

  await assertNotRateLimited(feedback);

  const token = await getShopifyToken();
  if (!token) {
    throw new Error(feedback.cart.signInToReorder);
  }

  const order = await getOrderById(token, parsed.data.orderId);
  if (!order) {
    throw new Error(feedback.cart.orderNotFound);
  }

  const lines: CartLineInput[] = [];
  let skipped = 0;

  for (const edge of order.lineItems.edges) {
    const variantId = edge.node.variant?.id;

    if (!variantId || edge.node.quantity < 1) {
      skipped += 1;
      continue;
    }

    if (edge.node.variant?.availableForSale === false) {
      skipped += 1;
      continue;
    }

    lines.push({
      merchandiseId: variantId,
      quantity: Math.min(edge.node.quantity, MAX_QUANTITY),
    });

    if (lines.length >= MAX_LINES_PER_REQUEST) break;
  }

  if (lines.length === 0) {
    throw new Error(feedback.cart.reorderNone);
  }

  const cart = await CartService.addLines(lines);

  return {
    data: cart,
    message:
      skipped > 0
        ? feedback.cart.reorderItemsSkipped
            .replace('{lines}', String(lines.length))
            .replace('{skipped}', String(skipped))
        : feedback.cart.reorderItems.replace('{lines}', String(lines.length)),
  };
}
