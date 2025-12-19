'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import { storefrontSdk } from '@/shopify';
import { getShopifyToken, setShopifyToken } from '@/utils/shopify';

import { delCookieAction } from './cookiesActions';

const userSchema = z.object({
  acceptsMarketing: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
});

type UpdateUserInput = z.infer<typeof userSchema>;

export async function updateUserAction(input: UpdateUserInput) {
  const result = userSchema.safeParse(input);

  if (!result?.success) {
    return result.error.formErrors.fieldErrors;
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

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  if (customerAccessToken) {
    await setShopifyToken(customerAccessToken);
  }

  if (customer) {
    revalidatePath(config.routes.updateAccount);
    return {
      customer,
      success: 'User updated successfully',
    };
  }

  return { error: 'Failed to update user' };
}

export const logoutAction = async () => {
  await delCookieAction(config.cookies.shopifyToken);
  redirect(config.routes.login);
};
