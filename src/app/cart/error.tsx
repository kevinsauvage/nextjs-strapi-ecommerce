'use client';

import { useEffect } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const CartError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('Cart error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        altText="Cart error illustration"
        image={NotFoundIllustration}
        subtitle="We couldn't load your cart. Please try again or contact support if the problem persists."
        title="Unable to load cart"
      >
        <div className="mt-6 flex gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Continue shopping
          </Button>
        </div>
      </EmptyState>
    </div>
  );
};

export default CartError;
