import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { createAddressAction } from '@/actions/addressesActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.account.addresses.title,
  description: seo.account.addresses.description,
  url: '/account/addresses/create',
  noindex: true, // Private page, don't index
});

import AddressFormUI from '../_components/AddressForm';

const CreateAddresses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-heading-3">Addresses</h3>
        </CardTitle>
        <CardDescription className="max-w-md text-body text-secondary">
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
        <AddressFormUI address={undefined} action={createAddressAction} buttonText="Create" />
      </CardContent>
    </Card>
  );
};

export default CreateAddresses;
