import type { Metadata } from 'next';
import Link from 'next/link';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import seo from '@/data/seo';

import UserFullName from './_components/UserFullName';

export const dynamic = 'force-dynamic'; // Account data is user-specific

export const metadata: Metadata = {
  description: seo.account.description,
  title: seo.account.title,
};

const AccountCardCTA = ({
  title,
  description,
  buttonText,
  buttonLink,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}) => {
  return (
    <div className="border rounded-lg p-4 md:p-6">
      <div className="space-y-2">
        <h3 className="text-heading-4">{title}</h3>
        <p className="text-body-sm text-secondary">{description}</p>
      </div>
      <Button variant="secondary" size="sm" asChild>
        <Link href={buttonLink} scroll>
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

const Page = () => {
  return (
    <Card>
      <CardHeaderPattern
        className="w-full"
        title="Account Overview"
        size={3}
        description={
          <>
            Welcome <UserFullName />, your account dashboard provides access to all of your
            important account information and features.
          </>
        }
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-stretch">
          <AccountCardCTA
            title="Personal Information"
            description="Update your personal details and preferences"
            buttonText="Edit Details"
            buttonLink={config.routes.updateAccount}
          />
          <AccountCardCTA
            title="Addresses"
            description="Manage your shipping and billing addresses"
            buttonText="Edit Addresses"
            buttonLink={config.routes.addresses}
          />
          <AccountCardCTA
            title="Recent Orders"
            description="View and track your recent purchases and orders"
            buttonText="View Orders"
            buttonLink={config.routes.orders}
          />
          <AccountCardCTA
            title="Wishlist"
            description="View and manage your saved items"
            buttonText="View Wishlist"
            buttonLink={config.routes.wishlist}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
