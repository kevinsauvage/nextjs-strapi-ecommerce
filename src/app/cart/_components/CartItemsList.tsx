'use client';

import Link from 'next/link';

import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/contexts/CartContext/useCartContext';

import LineItem from './LineItem';

const CartItemsList = () => {
  const { cart } = useCartContext();
  const isEmpty = !cart.lines.edges || cart.lines.edges.length === 0;

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            variant="cart"
            image={{
              src: '/emptyCart.svg',
              width: 200,
              height: 200,
            }}
            title="Your cart is empty"
            subtitle="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
            altText="Empty shopping cart"
          >
            <div className="mt-6 flex flex-col items-center gap-4">
              <Link href="/">
                <Button size="lg" className="min-w-[200px]">
                  Start Shopping
                </Button>
              </Link>
              <p className="text-body-sm text-secondary text-center max-w-md">
                Browse our collections to discover amazing products. Add items to your cart and they&apos;ll appear here.
              </p>
            </div>
          </EmptyState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>
          <h2 className="text-heading-4">Cart Items</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cart.lines.edges.map(({ node }, index) => (
            <div key={node.id}>
              <LineItem node={node} />
              {index < cart.lines.edges.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </div>
      </CardContent>
      {cart.lines.pageInfo.hasNextPage && (
        <CardFooter className="pt-4 border-t">
          <p className="text-body-sm text-secondary">More items available</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartItemsList;

