'use server';

import { revalidatePath } from 'next/cache';

import config from '@/config';
import { handleCustomerUserErrors, zodErrorsToFormActionResult } from '@/lib/formActions';
import { storefrontSdk } from '@/shopify';
import type { FormActionResult } from '@/types/formActions';
import { getShopifyToken, setShopifyToken } from '@/utils/shopify';

import { delCookieAction } from './cookiesActions';

import { z } from 'zod';

const userSchema = z.object({
  acceptsMarketing: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
});

type UpdateUserInput = z.infer<typeof userSchema>;

type UpdateUserFieldErrors = {
  email?: string | string[];
  firstName?: string | string[];
  lastName?: string | string[];
  phone?: string | string[];
  company?: string | string[];
  acceptsMarketing?: string | string[];
};

export async function updateUserAction(
  input: UpdateUserInput,
): Promise<FormActionResult<UpdateUserFieldErrors> & UpdateUserFieldErrors> {
  const result = userSchema.safeParse(input);

  if (!result?.success) {
    const fieldErrors = result.error.formErrors.fieldErrors as UpdateUserFieldErrors;
    return { ...zodErrorsToFormActionResult(result.error), ...fieldErrors };
  }

  const { email, firstName, lastName, acceptsMarketing, company, phone } = result.data;

  const shopifyToken = await getShopifyToken();

  if (!shopifyToken) {
    return { error: 'User not logged in' };
  }

  const customerInput = {
    acceptsMarketing: acceptsMarketing === 'true',
    company,
    email,
    firstName,
    lastName,
    phone: phone || undefined,
  };

  const updateResponse = await storefrontSdk().customerUpdate({
    customer: customerInput,
    customerAccessToken: shopifyToken,
  });

  const { customerUserErrors, customer, customerAccessToken } =
    updateResponse?.customerUpdate || {};

  const errorResult = handleCustomerUserErrors(customerUserErrors);
  if (errorResult) return errorResult;

  if (customerAccessToken) {
    await setShopifyToken(customerAccessToken);
  }

  if (customer) {
    revalidatePath(config.routes.updateAccount);
    return {
      success: 'User updated successfully',
    };
  }

  return { error: 'Failed to update user' };
}

export const logoutAction = async () => {
  await delCookieAction(config.cookies.shopifyToken);
  return {
    success: 'Logged out successfully',
  };
};
