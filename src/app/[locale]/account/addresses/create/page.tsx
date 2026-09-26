import type { Metadata } from 'next';

import { createAddressAction } from '@/actions/addressesActions';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

import { ArrowLeft } from 'lucide-react';

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> =>
  generateMetadataUtil({
    title: seo.account.addresses.title,
    description: seo.account.addresses.description,
    url: '/account/addresses/create',
    noindex: true, // Private page, don't index
    locale: await localeFromParams(params),
  });

import AddressFormUI from '../_components/AddressForm';

const CreateAddresses = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');

  return (
    <Card>
      <CardHeaderPattern
        as="h2"
        title={t('createTitle')}
        size={3}
        descriptionClassName="max-w-md"
        description={t('createDescription')}
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
        <AddressFormUI
          address={undefined}
          action={createAddressAction}
          buttonText={t('createTitle')}
        />
      </CardContent>
    </Card>
  );
};

export default CreateAddresses;
