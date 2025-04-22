'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import { storefrontSdk } from '@/shopify';
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

export async function createAddressAction(previousState: unknown, data: FormData) {
  const result = addressSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const customerAccessToken = await getShopifyToken();

  const response = await storefrontSdk().customerAddressCreate({
    address: result.data,
    customerAccessToken,
  });

  const { customerUserErrors, customerAddress } = response?.customerAddressCreate || {};

  if (customerAddress) {
    return redirect(config.routes.addresses);
  }

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  return { error: defaultErrorMessage };
}

export async function deleteAddressAction(addressId: string) {
  const customerAccessToken = await getShopifyToken();

  const response = await storefrontSdk().customerAddressDelete({
    addressId,
    customerAccessToken,
  });

  const { customerUserErrors, deletedCustomerAddressId } = response?.customerAddressDelete || {};

  if (deletedCustomerAddressId) {
    return redirect(config.routes.addresses);
  }

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  return { error: defaultErrorMessage };
}

export async function setDefaultAddressAction(addressId: string) {
  const customerAccessToken = await getShopifyToken();

  let response;
  try {
    response = await storefrontSdk().customerDefaultAddressUpdate({
      addressId,
      customerAccessToken,
    });
  } catch (error) {
    console.error('Error setting default address:', JSON.stringify(error, undefined, 2));
    return { error: 'Failed to set default address' };
  }
  const { customerUserErrors, customer } = response?.customerDefaultAddressUpdate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }
  return customer ? redirect(config.routes.addresses) : { error: defaultErrorMessage };
}

export async function updateAddressAction(previousState: unknown, data: FormData) {
  const result = addressSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const customerAccessToken = await getShopifyToken();
  const { id, ...address } = result.data;

  const response = await storefrontSdk().customerAddressUpdate({
    address,
    addressId: id,
    customerAccessToken,
  });

  const { customerUserErrors, customerAddress } = response?.customerAddressUpdate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  if (customerAddress) {
    redirect(config.routes.addresses);
  }

  return { error: defaultErrorMessage };
}
