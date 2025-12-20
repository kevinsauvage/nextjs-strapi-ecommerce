import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';

import CartHeader from './_components/CartHeader';
import CartItemsList from './_components/CartItemsList';
import CartPromoCode from './_components/CartPromoCode';
import CartSummary from './_components/CartSummary';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  description: seo.cart.description,
  title: seo.cart.title,
};

const CartPage = () => {
  return (
    <div className="pb-8 max-w-6xl mx-auto">
      <PageBanner title="Your Cart" className="w-full pb-4">
        <div className="flex items-center justify-between gap-2 w-full">
          <Link
            href="/"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <CartHeader />
        </div>
      </PageBanner>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemsList />
        </div>

        <div>
          <CartSummary />
          <CartPromoCode />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
