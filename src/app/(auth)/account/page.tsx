import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';

import UserFullName from './_components/UserFullName';

const Page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>
          Welcome <UserFullName />, your account dashboard provides access to all of your important
          account information and features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This is your account dashboard. Select an option from the menu to manage different aspects
          of your account.
        </p>

        {/* Content for the selected section would go here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 justify-items-stretch">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your personal details and preferences
            </p>
            <Button variant="secondary" size="sm" asChild>
              <Link href={config.routes.updateAccount}>Edit Details</Link>
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and track your recent purchases and orders
            </p>
            <Button variant="secondary" size="sm" asChild>
              <Link href={config.routes.orders}>View Orders</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
