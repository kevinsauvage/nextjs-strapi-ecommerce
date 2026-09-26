import type { Metadata } from 'next';

import { updateAddressAction } from '@/actions/addressesActions';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import { storefrontSdk } from '@/shopify';
import { normalizeShopifyGid } from '@/utils/validation';

import { ArrowLeft } from 'lucide-react';

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    title: getSeo(locale).account.addresses.title,
    description: getSeo(locale).account.addresses.description,
    url: '/account/addresses/edit',
    noindex: true, // Private page, don't index
    locale,
  });
};

import AddressForm from '../_components/AddressForm';

type PageProperties = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    id: string;
    customer_access_token: string;
  }>;
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
  // Forward the full Shopify id (token suffix included): customer address
  // mutations resolve the address from the suffixed form.
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

  const normalizedId = normalizeShopifyGid(id);
  const node = addresses.edges
    .map((item) => item.node)
    .find((n) => normalizeShopifyGid(n.id) === normalizedId);

  return node || null;
};

const EditAddress = async ({ params, searchParams }: PageProperties) => {
  const locale = await localeFromParams(params);
  const searchParameters = await searchParams;
  const { id } = searchParameters;

  if (!id) {
    redirectToPath(config.routes.addresses, locale);
  }

  const customerAccessToken = await getShopifyToken();
  if (!customerAccessToken) {
    redirectToPath(config.routes.login, locale);
  }

  const response = await storefrontSdk('private').getCustomerAddresses({
    customerAccessToken,
    first: 100,
  });

  const addressNode = findAddressById(response?.customer?.addresses, id);
  if (!addressNode) {
    redirectToPath(config.routes.addresses, locale);
  }

  const address = mapAddressNodeToFormData(addressNode);
  const t = getTranslations(locale, 'account');

  return (
    <Card>
      <CardHeaderPattern
        as="h2"
        title={t('editTitle')}
        size={3}
        descriptionClassName="max-w-md"
        description={t('editDescription')}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href={config.routes.addresses} className="gap-2">
              <ArrowLeft size={16} />
              {t('backToAddresses')}
            </Link>
          </Button>
        }
      />
      <CardContent>
        <AddressForm address={address} action={updateAddressAction} buttonText={t('saveAddress')} />
      </CardContent>
    </Card>
  );
};

export default EditAddress;
