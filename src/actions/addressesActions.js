'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import getClient from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';

const defaultErrorMessage = 'Something went wrong';

const addressSchema = z.object({
  address1: z.string().nonempty('Address is required'),
  address2: z.string().optional(),
  city: z.string().nonempty('City is required'),
  company: z.string().optional(),
  country: z.string().nonempty('Country is required'),
  firstName: z.string().nonempty('First name is required'),
  id: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
  phone: z.string().optional(),
  province: z.string().optional(),
  zip: z.string().nonempty('Zip is required'),
});

export async function createAddressAction(previousState, data) {
  const result = addressSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const customerAccessToken = await getShopifyToken();

  const client = getClient();
  const response = await client.storefront.customer.customerAddressCreate({
    address: result.data,
    customerAccessToken,
  });

  if (response?.customerAddress) {
    return redirect(config.routes.addresses);
  }

  if (response?.customerUserErrors) {
    return response.customerUserErrors[0].message;
  }

  return defaultErrorMessage;
}

export async function deleteAddressAction(addressId) {
  const customerAccessToken = await getShopifyToken();

  const client = getClient();
  const response = await client.storefront.customer.customerAddressDelete({
    addressId,
    customerAccessToken,
  });

  if (response?.deletedCustomerAddressId) {
    return redirect(config.routes.addresses);
  }

  if (response?.customerUserErrors) {
    return { error: response.customerUserErrors[0].message };
  }

  return defaultErrorMessage;
}

export async function setDefaultAddressAction(addressId) {
  const customerAccessToken = await getShopifyToken();
  const client = getClient();
  const response = await client.storefront.customer.customerDefaultAddressUpdate({
    addressId,
    customerAccessToken,
  });

  if (response?.customer?.id) {
    return redirect(config.routes.addresses);
  }

  if (response?.customerUserErrors) {
    return { error: response.customerUserErrors[0].message };
  }

  return defaultErrorMessage;
}

export async function updateAddressAction(previousState, data) {
  const result = addressSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const customerAccessToken = await getShopifyToken();

  const { id, ...address } = result.data;

  const client = getClient();
  const response = await client.storefront.customer.customerAddressUpdate({
    address,
    addressId: id,
    customerAccessToken,
  });

  if (response?.customerAddress) {
    return redirect(config.routes.addresses);
  }

  if (response?.customerUserErrors) {
    return response.customerUserErrors[0].message;
  }

  return defaultErrorMessage;
}
