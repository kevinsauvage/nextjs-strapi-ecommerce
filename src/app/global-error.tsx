'use client';

import { useEffect } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <EmptyState
            variant="error"
            altText="Error illustration"
            image={NotFoundIllustration}
            subtitle="A critical error occurred. Please try refreshing the page or contact support if the problem persists."
            title="Critical Error"
            tips={[
              'Refresh the page',
              'Clear browser cache and cookies',
              'Contact support if the issue persists',
            ]}
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
      </body>
    </html>
  );
};

export default GlobalError;
