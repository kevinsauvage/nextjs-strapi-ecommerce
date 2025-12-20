'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/contexts/CartContext/useCartContext';

import LineItem from './LineItem';

const CartItemsList = () => {
  const { cart } = useCartContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-medium">Cart Items</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cart.lines.edges && cart.lines.edges.length > 0 ? (
            cart.lines.edges.map(({ node }, index) => (
              <div key={node.id}>
                <LineItem node={node} />
                {index < cart.lines.edges.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-lg text-muted-foreground">Your cart is empty</p>
              <Link href="/" className="mt-4 text-sm hover:underline">
                <Button variant="secondary">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {cart.lines.pageInfo.hasNextPage && (
          <div className="text-sm text-muted-foreground">More items available</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CartItemsList;

