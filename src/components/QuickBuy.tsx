'use client';

import { Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

import type { ProductFieldsFragment } from '@/shopify/storefront';

import SpinnerLoader from './SpinnerLoader';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

// Only load QuickBuyContent when sheet is opened
const QuickBuyContent = dynamic(() => import('./QuickBuyContent'), {
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <SpinnerLoader />
    </div>
  ),
});

type QuickBuyProps = {
  product: ProductFieldsFragment;
};

const QuickBuy = ({ product }: QuickBuyProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100 hover:scale-110"
          type="button"
          aria-label="Quick view"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full gap-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Quick view</SheetTitle>
        </SheetHeader>
        {isOpen && <QuickBuyContent product={product} onClose={handleClose} />}
      </SheetContent>
    </Sheet>
  );
};

export default QuickBuy;
