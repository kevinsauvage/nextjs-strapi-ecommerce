import { User } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import AccountNavigation from './_components/AccountNavigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <PageBanner title="Account">
        <Breadcrumbs />
      </PageBanner>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar for desktop */}
        <Card className="hidden md:block">
          <CardHeader className="mb-8">
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <AccountNavigation />
          </CardContent>
        </Card>
        {/* Mobile menu */}
        <div className="md:hidden w-full mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                <span>Account Navigation</span>
                <User className="h-4 w-4 ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-2">Account</h2>
                <AccountNavigation />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
