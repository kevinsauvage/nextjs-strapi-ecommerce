import { redirect } from 'next/navigation';

import config from '@/config';
import { storefrontSdk } from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';

import EditAddressForm from './_components/EditAddressForm';

type PageProperties = {
  searchParams: Promise<{
    id: string;
    customer_access_token: string;
  }>;
};
const EditAddress = async ({ searchParams }: PageProperties) => {
  const searchParameters = await searchParams;

  const { id } = searchParameters;

  if (!id) {
    redirect(config.routes.addresses);
  }

  const customerAccessToken = await getShopifyToken();

  if (!customerAccessToken) {
    redirect(config.routes.login);
  }

  const response = await storefrontSdk().getCustomerAddresses({
    customerAccessToken,
    first: 100,
  });

  const { addresses } = response?.customer || {};

  if (!addresses || !Array.isArray(addresses.edges) || addresses.edges.length === 0) {
    redirect(config.routes.addresses);
  }

  const address =
    Array.isArray(addresses.edges) &&
    addresses?.edges
      ?.map((item) => item.node)
      .find((item) => item.id?.split('?')[0] === id.split('?')[0]);

  return (
    <div>
      <h2>Edit address</h2>
      <EditAddressForm address={address} />
    </div>
  );
};

export default EditAddress;
