'use client';

import Link from 'next/link';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
            primaryAction={
              <Link href="/">
                <Button size="lg" className="min-w-[200px]">
                  Start Shopping
                </Button>
              </Link>
            }
            secondaryAction={
              <Link href="/collections" className="link">
                Browse collections
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeaderPattern className="pb-4" title="Cart Items" size={4} />
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
