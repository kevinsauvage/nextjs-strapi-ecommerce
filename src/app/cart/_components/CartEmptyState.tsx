import Link from 'next/link';

import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CartEmptyState = () => {
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
};

export default CartEmptyState;

