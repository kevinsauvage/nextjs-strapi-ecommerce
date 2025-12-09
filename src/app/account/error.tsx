'use client';

import { useEffect } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const AccountError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Account error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        altText="Account error illustration"
        image={NotFoundIllustration}
        subtitle="We couldn't load your account information. Please try again or contact support if the problem persists."
        title="Unable to load account"
      >
        <div className="mt-6 flex gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Go home
          </Button>
        </div>
      </EmptyState>
    </div>
  );
};

export default AccountError;
