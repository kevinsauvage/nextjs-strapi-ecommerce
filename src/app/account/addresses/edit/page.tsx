import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { updateAddressAction } from '@/actions/addressesActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify';
import { getShopifyToken } from '@/utils/shopify';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.account.addresses.title,
  description: seo.account.addresses.description,
  url: '/account/addresses/edit',
  noindex: true, // Private page, don't index
});

import AddressForm from '../_components/AddressForm';

type PageProperties = {
  searchParams: Promise<{
    id: string;
    customer_access_token: string;
  }>;
};

const normalizeAddressId = (id: string | null | undefined): string => {
  return id?.split('?')[0] || '';
};

const mapAddressNodeToFormData = (addressNode: {
  id?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  company?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  province?: string | null;
  zip?: string | null;
}) => ({
  address1: addressNode.address1 ?? '',
  address2: addressNode.address2 ?? undefined,
  city: addressNode.city ?? '',
  company: addressNode.company ?? undefined,
  country: addressNode.country ?? '',
  firstName: addressNode.firstName ?? '',
  id: addressNode.id ?? '',
  lastName: addressNode.lastName ?? '',
  phone: addressNode.phone ?? undefined,
  province: addressNode.province ?? undefined,
  zip: addressNode.zip ?? '',
});

type AddressNode = {
  id?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  company?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  province?: string | null;
  zip?: string | null;
};

const findAddressById = (
  addresses:
    | {
        edges?: Array<{
          node: AddressNode;
        }>;
      }
    | null
    | undefined,
  id: string,
) => {
  if (!addresses?.edges || addresses.edges.length === 0) {
    return null;
  }

  const normalizedId = normalizeAddressId(id);
  const node = addresses.edges
    .map((item) => item.node)
    .find((n) => normalizeAddressId(n.id) === normalizedId);

  return node || null;
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

  const addressNode = findAddressById(response?.customer?.addresses, id);
  if (!addressNode) {
    redirect(config.routes.addresses);
  }

  const address = mapAddressNodeToFormData(addressNode);

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
