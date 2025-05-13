import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { updateAddressAction } from '@/actions/addressesActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import { storefrontSdk } from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';

import AddressForm from '../_components/AddressForm';

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
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Edit Addresses</h2>
        </CardTitle>
        <CardDescription className="max-w-md">
          <p>
            Add a new address to your account. This will help us deliver your orders more
            efficiently.
          </p>
          <Button variant="secondary" className="mt-4" size="sm">
            <ArrowLeft size={16} />
            <Link href={config.routes.addresses}>Back to addresses</Link>
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddressForm address={address} action={updateAddressAction} buttonText="Edit" />
      </CardContent>
    </Card>
  );
};

export default EditAddress;
