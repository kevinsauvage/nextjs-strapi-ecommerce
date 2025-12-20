import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import NoAddressIllustration from '@/assets/NoAddressIllustration.png';
import EmptyState from '@/components/EmptyState';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config/index';
import seo from '@/data/seo';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import type { MailingAddress } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import BackButton from '../_components/BackButton';
import Address from './_components/Address';

export const dynamic = 'force-dynamic'; // Addresses are user-specific

export const metadata: Metadata = {
  description: seo.account.addresses.description,
  title: seo.account.addresses.title,
};

const Addresses = async ({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string; sort_key?: string }>;
}) => {
  const searchParameters = await searchParams;
  const customerAccessToken = await getShopifyToken();

  if (!customerAccessToken) {
    redirect(config.routes.login);
  }

  const response = await storefrontSdk().getCustomerAddresses({
    ...adjustPaginationVariables({
      after: searchParameters.after || undefined,
      before: searchParameters.before || undefined,
      first: 6,
    }),
    customerAccessToken,
  });

  const addresses =
    response?.customer?.addresses?.edges?.map((edge) => ({
      ...edge.node,
    })) || [];

  const pageInfo = response?.customer?.addresses.pageInfo;
  const user = await getUser();

  const isDefault = (address: MailingAddress) =>
    address.id?.split('?')?.[0] === user?.defaultAddress?.id?.split('?')?.[0];

  const hasAddresses = Array.isArray(addresses) && addresses.length > 0;

  if (!hasAddresses) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="addresses"
            image={NoAddressIllustration}
            title="No Address Yet"
            subtitle="Add your shipping addresses to make checkout faster and easier. You can add multiple addresses and set a default."
            altText="No Address Yet"
          >
            <Link href={config.routes.createAddress} className="mt-4">
              <Button variant="default" className="gap-2">
                <Plus size={16} />
                Add new address
              </Button>
            </Link>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  if (!pageInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-heading-3">Addresses</h3>
        </CardTitle>
        <CardDescription className="text-body text-secondary">
          <p className="mb-4">Manage your addresses for a better shopping experience.</p>
          <div className="flex items-center gap-2 flex-wrap">
            <BackButton />
            <Button variant="default">
              <Link href={config.routes.createAddress}>Add new address</Link>
              <Plus size={16} />
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {addresses.map((item) => (
            <Address key={item.id} address={item} isDefault={isDefault(item)} />
          ))}
        </div>
        <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
      </CardContent>
    </Card>
  );
};

export default Addresses;
