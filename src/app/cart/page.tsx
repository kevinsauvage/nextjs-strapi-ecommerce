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
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageBanner title="Your Cart" className="w-full pb-6">
        <div className="flex items-center justify-between gap-4 w-full flex-wrap">
          <Link
            href="/"
            className="flex items-center text-body-sm text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <CartHeader />
        </div>
      </PageBanner>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <CartItemsList />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CartSummary />
          <CartPromoCode />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
