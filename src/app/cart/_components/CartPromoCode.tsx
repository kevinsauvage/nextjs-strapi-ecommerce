'use client';

import { Tag } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import CouponCodeForm from './CouponCodeForm';
import DiscountCodes from './DiscountCodes';

const CartPromoCode = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Promo Code</h2>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your promo code to get a discount on your order.
        </p>
      </CardHeader>
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
