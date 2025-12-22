'use client';

import { Tag } from 'lucide-react';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import CouponCodeForm from './CouponCodeForm';
import DiscountCodes from './DiscountCodes';

const CartPromoCode = () => {
  return (
    <Card>
      <CardHeaderPattern
        className="pb-4"
        size={4}
        title={
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-secondary" />
            Promo Code
          </span>
        }
        description="Enter a promo code to apply a discount to your order."
      />
      <CardContent>
        <CouponCodeForm />
      </CardContent>
      <CardFooter className="pt-4">
        <DiscountCodes />
      </CardFooter>
    </Card>
  );
};

export default CartPromoCode;
