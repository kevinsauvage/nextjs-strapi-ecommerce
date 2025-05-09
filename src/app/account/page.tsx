import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';

import UserFullName from './_components/UserFullName';

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
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button variant="secondary" size="sm" asChild>
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
};

const Page = () => {
  return (
    <Card>
      <CardHeader className="text-center max-w-lg mx-auto w-full">
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>
          Welcome <UserFullName />, your account dashboard provides access to all of your important
          account information and features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 justify-items-stretch">
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
