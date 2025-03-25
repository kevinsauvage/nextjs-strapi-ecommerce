import { redirect } from 'next/dist/server/api-utils';

import config from '@/config';
import getClient from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';

import EditAddressForm from './_components/EditAddressForm';

const EditAddress = async ({ searchParams }) => {
  const searchParameters = await searchParams;

  const { id, customer_access_token } = searchParameters;

  if (!id) {
    redirect(config.routes.addresses);
  }

  const customerAccessToken = await getShopifyToken();

  const addressId = `${id}&customerAccessToken=${customer_access_token}`;

  const response = await getClient().storefront.customer.queryCustomerAddresses({
    customerAccessToken,
    first: 100,
  });

  const address = response?.find((item) => item.id.split('?')[0] === addressId.split('?')[0]);

  return (
    <div>
      <h2>Edit address</h2>
      <EditAddressForm title="Edit address" address={address} />
    </div>
  );
};

export default EditAddress;
