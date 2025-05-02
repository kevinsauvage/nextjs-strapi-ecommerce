import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { createAddressAction } from '@/actions/addressesActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';

import AddressFormUI from '../_components/AddressForm';

const CreateAddresses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
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
        <AddressFormUI address={undefined} action={createAddressAction} buttonText="Create" />
      </CardContent>
    </Card>
  );
};

export default CreateAddresses;
