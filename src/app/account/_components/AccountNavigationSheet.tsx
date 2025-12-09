'use client';

import { User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import AccountNavigation from './AccountNavigation';

const AccountNavigationSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          <span>Account Navigation</span>
          <User className="h-4 w-4 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md"
        aria-describedby='"Account Navigation">'
      >
        <SheetHeader>
          <SheetTitle>Account Navigation</SheetTitle>
          <SheetDescription>
            Navigate through your account settings and information.
          </SheetDescription>
        </SheetHeader>
        <AccountNavigation handleClose={handleClose} />
      </SheetContent>
    </Sheet>
  );
};
export default AccountNavigationSheet;
