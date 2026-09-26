'use server';

import config from '@/config';
import { getUserFeedback, type UserFeedback } from '@/data/userFeedback';
import { getCurrentLocale, redirectToPath } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { fingerprintForRateLimit, getClientIp, rateLimitKey } from '@/lib/server/client-ip';
import { isRateLimited } from '@/lib/server/rate-limit';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { AddressService } from '@/services/address.service';
import type { FormState } from '@/types/formActions';
import { formError, serviceErrorsToFormState, zodErrorsToFormState } from '@/utils/form-actions';
import { companyField, phoneField, shopifyCustomerAddressIdField } from '@/utils/validation';

import { z } from 'zod';

const getAddressSchema = (feedback: UserFeedback) =>
  z.object({
    address1: z.string().trim().min(1, feedback.addresses.requiredAddress).max(255),
    address2: z.string().trim().max(255).optional(),
    city: z.string().trim().min(1, feedback.addresses.requiredCity).max(100),
    company: companyField,
    country: z.string().trim().min(1, feedback.addresses.requiredCountry).max(100),
    firstName: z.string().trim().min(1, feedback.addresses.requiredFirstName).max(100),
    id: z.string().optional(),
    lastName: z.string().trim().min(1, feedback.addresses.requiredLastName).max(100),
    phone: phoneField,
    province: z.string().trim().max(100).optional(),
    zip: z.string().trim().min(1, feedback.addresses.requiredZip).max(20),
  });

type AddressInput = z.infer<ReturnType<typeof getAddressSchema>>;

/**
 * Throttle address writes (each is a Shopify Admin mutation). Fail closed, and
 * key by IP plus the fingerprinted session token so off-Vercel `unknown`-IP
 * traffic does not share one global bucket. Returns an error state when
 * limited, `null` when the caller may proceed.
 */
const assertNotRateLimited = async (feedback: UserFeedback): Promise<FormState | null> => {
  const [ip, token] = await Promise.all([getClientIp(), getShopifyToken()]);
  const limited = await isRateLimited(
    'address:write',
    rateLimitKey(ip, token ? fingerprintForRateLimit(token) : null),
    30,
    '1 m',
    { failClosed: true },
  );

  return limited ? formError(feedback.rateLimit.addressUpdates) : null;
};

export async function createAddressAction(input: AddressInput): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = getAddressSchema(feedback).safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const limited = await assertNotRateLimited(feedback);
  if (limited) return limited;

  let serviceResult;
  try {
    serviceResult = await AddressService.createAddress(result.data, feedback);
  } catch (error) {
    reportError('createAddressAction', error);
    return formError(feedback.addresses.createFailed);
  }

  const errorState = serviceErrorsToFormState(serviceResult, feedback.addresses.createFailed);
  if (errorState) return errorState;

  redirectToPath(config.routes.addresses, await getCurrentLocale());
}

export async function deleteAddressAction(addressId: string): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  // Customer address IDs arrive with Shopify's `?model_name=…&customer_access_token=…`
  // suffix (~350 chars). Validate with the address-aware bound, and forward the
  // FULL id: Shopify resolves the address from the suffixed form and answers
  // RESOURCE_NOT_FOUND for the stripped GID.
  if (!shopifyCustomerAddressIdField.safeParse(addressId).success) {
    return formError(feedback.addresses.invalid);
  }

  const limited = await assertNotRateLimited(feedback);
  if (limited) return limited;

  let serviceResult;
  try {
    serviceResult = await AddressService.deleteAddress(addressId, feedback);
  } catch (error) {
    reportError('deleteAddressAction', error);
    return formError(feedback.addresses.deleteFailed);
  }

  const errorState = serviceErrorsToFormState(serviceResult, feedback.addresses.deleteFailed);
  if (errorState) return errorState;

  redirectToPath(config.routes.addresses, await getCurrentLocale());
}

export async function setDefaultAddressAction(addressId: string): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  // See `deleteAddressAction`: validate the suffixed id, forward it untouched.
  if (!shopifyCustomerAddressIdField.safeParse(addressId).success) {
    return formError(feedback.addresses.invalid);
  }

  const limited = await assertNotRateLimited(feedback);
  if (limited) return limited;

  let serviceResult;
  try {
    serviceResult = await AddressService.setDefaultAddress(addressId, feedback);
  } catch (error) {
    reportError('setDefaultAddressAction', error);
    return formError(feedback.addresses.defaultFailed);
  }

  const errorState = serviceErrorsToFormState(serviceResult, feedback.addresses.defaultFailed);
  if (errorState) return errorState;

  redirectToPath(config.routes.addresses, await getCurrentLocale());
}

export async function updateAddressAction(input: AddressInput): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = getAddressSchema(feedback).safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const limited = await assertNotRateLimited(feedback);
  if (limited) return limited;

  let serviceResult;
  try {
    serviceResult = await AddressService.updateAddress(result.data, feedback);
  } catch (error) {
    reportError('updateAddressAction', error);
    return formError(feedback.addresses.updateFailed);
  }

  const errorState = serviceErrorsToFormState(serviceResult, feedback.addresses.updateFailed);
  if (errorState) return errorState;

  redirectToPath(config.routes.addresses, await getCurrentLocale());
}
