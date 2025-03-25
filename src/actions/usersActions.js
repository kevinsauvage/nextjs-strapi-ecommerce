'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import getClient from '@/shopify';
import { getShopifyToken, setShopifyToken } from '@/utils/shopify';

import { delCookieAction } from './cookiesActions';

const userSchema = z.object({
  acceptsMarketing: z.string(),
  company: z.string().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
});

export async function updateUserAction(previousState, data) {
  const result = userSchema.safeParse(Object.fromEntries(data.entries()));

  if (!result?.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { email, firstName, lastName, acceptsMarketing, company, phone } = result.data;

  const shopifyToken = await getShopifyToken();

  const customerInput = {
    acceptsMarketing: acceptsMarketing === 'true',
    company,
    email,
    firstName,
    lastName,
    phone: phone || undefined,
  };

  const updateResponse = await getClient().storefront.customer.customerUpdate({
    customer: customerInput,
    customerAccessToken: shopifyToken,
  });

  const { customerUserErrors, customer, customerAccessToken } = updateResponse || {};

  if (customerAccessToken) {
    setShopifyToken(customerAccessToken);
  }

  if (customerUserErrors?.length) {
    return { error: true, message: customerUserErrors[0].message };
  }

  if (customer) {
    return {
      customer,
      message: 'User updated successfully',
      success: true,
    };
  }

  return 'Something went wrong';
}

export const logoutAction = async () => {
  delCookieAction(config.cookies.shopifyToken);
  redirect('/login');
};
