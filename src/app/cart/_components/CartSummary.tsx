'use client';

import CheckoutButton from '@/components/CheckoutButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CartSummary = () => {
  const { cart } = useCartContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Order Summary</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              ${cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>
              ${cart.cost.totalTaxAmount?.amount ?? '0.00'} {cart.cost.totalTaxAmount?.currencyCode}
            </span>
          </div>
          {Number(cart.cost.totalAmount.amount) < Number(cart.cost.subtotalAmount.amount) && (
            <div className="flex justify-between">
              <span>Discount</span>
              <span>
                {(Number(cart.cost.totalAmount.amount) - Number(cart.cost.subtotalAmount.amount)).toFixed(2)}{' '}
                {cart.cost.subtotalAmount.currencyCode}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>
              ${cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <CheckoutButton checkoutUrl={String(cart.checkoutUrl)} />
      </CardFooter>
    </Card>
  );
};

export default CartSummary;

