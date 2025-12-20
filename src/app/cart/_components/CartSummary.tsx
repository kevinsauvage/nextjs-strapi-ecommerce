'use client';

import CheckoutButton from '@/components/CheckoutButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { formatPrice } from '@/utils/format';

const CartSummary = () => {
  const { cart } = useCartContext();
  const subtotal = Number.parseFloat(cart.cost.subtotalAmount.amount);
  const total = Number.parseFloat(cart.cost.totalAmount.amount);
  const tax = Number.parseFloat(cart.cost.totalTaxAmount?.amount ?? '0');
  const discount = subtotal - total + tax;
  const hasDiscount = discount > 0;
  const currencyCode = cart.cost.subtotalAmount.currencyCode;

  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader className="pb-4">
        <CardTitle>
          <h2 className="text-xl font-semibold">Order Summary</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal, currencyCode)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatPrice(discount, currencyCode)}
              </span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatPrice(tax, currencyCode)}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between items-baseline pt-2">
          <span className="text-base font-semibold">Total</span>
          <span className="text-2xl font-bold">{formatPrice(total, currencyCode)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <CheckoutButton checkoutUrl={String(cart.checkoutUrl)} />
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
