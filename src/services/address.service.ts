import 'server-only';

import { type UserFeedback, userFeedback } from '@/data/userFeedback';
import { reportError } from '@/lib/logger';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { storefrontSdk } from '@/shopify';
import { handleCustomerUserErrors } from '@/utils/form-actions';

type AddressInput = {
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  country: string;
  firstName: string;
  id?: string;
  lastName: string;
  phone?: string;
  province?: string;
  zip: string;
};

/**
 * Run a customer-scoped Storefront mutation: check the session token,
 * report + map transport failures, and let the caller map user errors.
 */
const withCustomerToken = async <T>(
  context: string,
  failureMessage: string,
  run: (customerAccessToken: string) => Promise<T>,
  feedback: UserFeedback = userFeedback,
): Promise<T | { error: string }> => {
  const customerAccessToken = await getShopifyToken();
  if (!customerAccessToken) {
    return { error: feedback.addresses.unauthenticated };
  }

  try {
    return await run(customerAccessToken);
  } catch (error) {
    reportError(context, error);
    return { error: failureMessage };
  }
};

/**
 * Address service
 * Handles all address-related business logic
 */
export class AddressService {
  /**
   * Create a new address
   */
  static async createAddress(input: AddressInput, feedback: UserFeedback = userFeedback) {
    const response = await withCustomerToken(
      'AddressService.createAddress',
      feedback.addresses.createFailed,
      (customerAccessToken) =>
        storefrontSdk('private').customerAddressCreate({
          address: input,
          customerAccessToken,
        }),
      feedback,
    );
    if ('error' in response) return response;

    const { customerUserErrors, customerAddress } = response?.customerAddressCreate || {};

    if (customerAddress) {
      return { success: true, customerAddress };
    }

    const errorResult = handleCustomerUserErrors(customerUserErrors);
    if (errorResult) return errorResult;

    return { error: feedback.addresses.generic };
  }

  /**
   * Update an existing address
   */
  static async updateAddress(input: AddressInput, feedback: UserFeedback = userFeedback) {
    const { id, ...address } = input;
    if (!id) {
      return { error: feedback.addresses.idRequired };
    }

    const response = await withCustomerToken(
      'AddressService.updateAddress',
      feedback.addresses.updateFailed,
      (customerAccessToken) =>
        storefrontSdk('private').customerAddressUpdate({
          address,
          addressId: id,
          customerAccessToken,
        }),
      feedback,
    );
    if ('error' in response) return response;

    const { customerUserErrors, customerAddress } = response?.customerAddressUpdate || {};

    const errorResult = handleCustomerUserErrors(customerUserErrors);
    if (errorResult) return errorResult;

    if (customerAddress) {
      return { success: true, customerAddress };
    }

    return { error: feedback.addresses.generic };
  }

  /**
   * Delete an address
   */
  static async deleteAddress(addressId: string, feedback: UserFeedback = userFeedback) {
    const response = await withCustomerToken(
      'AddressService.deleteAddress',
      feedback.addresses.deleteFailed,
      (customerAccessToken) =>
        storefrontSdk('private').customerAddressDelete({
          addressId,
          customerAccessToken,
        }),
      feedback,
    );
    if ('error' in response) return response;

    const { customerUserErrors, deletedCustomerAddressId } = response?.customerAddressDelete || {};

    if (deletedCustomerAddressId) {
      return { success: true, deletedCustomerAddressId };
    }

    const errorResult = handleCustomerUserErrors(customerUserErrors);
    if (errorResult) return errorResult;

    return { error: feedback.addresses.generic };
  }

  /**
   * Set default address
   */
  static async setDefaultAddress(addressId: string, feedback: UserFeedback = userFeedback) {
    const response = await withCustomerToken(
      'AddressService.setDefaultAddress',
      feedback.addresses.defaultFailed,
      (customerAccessToken) =>
        storefrontSdk('private').customerDefaultAddressUpdate({
          addressId,
          customerAccessToken,
        }),
      feedback,
    );
    if ('error' in response) return response;

    const { customerUserErrors, customer } = response?.customerDefaultAddressUpdate || {};

    const errorResult = handleCustomerUserErrors(customerUserErrors);
    if (errorResult) return errorResult;

    if (customer) {
      return { success: true, customer };
    }

    return { error: feedback.addresses.generic };
  }
}
