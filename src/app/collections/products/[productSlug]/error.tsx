'use client';

import { useEffect } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const ProductError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Product error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        altText="Product error illustration"
        image={NotFoundIllustration}
        subtitle="We couldn't load this product. Please try again or browse our other products."
        title="Unable to load product"
      >
        <div className="mt-6 flex gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/collections')} variant="outline">
            Browse products
          </Button>
        </div>
      </EmptyState>
    </div>
  );
};

export default ProductError;
