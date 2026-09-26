'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { reportError } from '@/lib/logger';

const CartError = ({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) => {
  const t = useTranslations('error');

  useEffect(() => {
    reportError('app/cart-error-boundary', error, { digest: error.digest });
  }, [error]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        variant="error"
        altText={t('cartAltText')}
        image={NotFoundIllustration}
        subtitle={t('cartSubtitle')}
        title={t('cartTitle')}
        tips={[t('cartTips.0'), t('cartTips.1'), t('cartTips.2')]}
        tipsLabel={t('helpfulTips')}
        primaryAction={
          <Button onClick={() => retry()} variant="default">
            {t('retry')}
          </Button>
        }
        secondaryAction={
          <Link href={config.routes.collection} className="link">
            {t('continueShopping')}
          </Link>
        }
      />
    </div>
  );
};

export default CartError;
