'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import config from '@/config';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        variant="error"
        altText="Error illustration"
        image={NotFoundIllustration}
        subtitle="Something went wrong. Please try again or contact support if the problem persists."
        title="Oops! Something went wrong"
        tips={[
          'Try refreshing the page',
          'Clear your browser cache',
          'Check your internet connection',
        ]}
        primaryAction={
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        }
        secondaryAction={
          <Link href={config.routes.home} className="link">
            Go home
          </Link>
        }
      />
    </div>
  );
};

export default Error;
