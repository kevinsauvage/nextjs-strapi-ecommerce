import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import AccountNavigation from './_components/AccountNavigation';
import AccountNavigationSheet from './_components/AccountNavigationSheet';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-5xl pb-12 mx-auto">
      <PageBanner
        title="Account"
        description="Welcome to your account dashboard. Here you can view and update your personal information, manage your orders, addresses, and preferences, as well as access all your account-related settings and features."
      >
        <Breadcrumbs />
      </PageBanner>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hidden md:block h-fit">
          <CardHeader className="mb-8">
            <CardTitle>
              <h3 className="text-heading-4">Navigation</h3>
            </CardTitle>
            <CardDescription className="text-body-sm text-secondary">Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <AccountNavigation />
          </CardContent>
        </Card>
        <div className="md:hidden w-full mb-6">
          <AccountNavigationSheet />
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
