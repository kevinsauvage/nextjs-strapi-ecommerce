'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import CouponCodeForm from './CouponCodeForm';
import DiscountCodes from './DiscountCodes';

const CartPromoCode = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Promo Code</h2>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your promo code to get a discount on your order.
        </p>
      </CardHeader>
      <CardContent>
        <CouponCodeForm />
      </CardContent>
      <CardFooter>
        <DiscountCodes />
      </CardFooter>
    </Card>
  );
};

export default CartPromoCode;
