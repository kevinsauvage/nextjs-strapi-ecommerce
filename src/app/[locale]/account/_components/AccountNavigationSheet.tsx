'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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

import { Menu } from 'lucide-react';

const AccountNavigationSheet = () => {
  const t = useTranslations('account');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>{t('navMenu')}</span>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-6 pt-6 pb-5">
          <SheetTitle className="text-heading-3">{t('navAria')}</SheetTitle>
          <SheetDescription
            id="account-navigation-description"
            className="text-body-sm text-secondary"
          >
            {t('navDescription')}
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-3 py-3">
          <AccountNavigation
            handleClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountNavigationSheet;
