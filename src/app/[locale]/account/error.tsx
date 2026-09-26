'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { reportError } from '@/lib/logger';

const AccountError = ({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) => {
  const t = useTranslations('error');

  useEffect(() => {
    reportError('app/account-error-boundary', error, { digest: error.digest });
  }, [error]);

  return (
    <Card>
      <CardContent className="py-12">
        <EmptyState
          variant="error"
          altText={t('accountAltText')}
          image={NotFoundIllustration}
          subtitle={t('accountSubtitle')}
          title={t('accountTitle')}
          tips={[t('accountTips.0'), t('accountTips.1'), t('accountTips.2')]}
          tipsLabel={t('helpfulTips')}
          primaryAction={
            <Button onClick={() => retry()} variant="default">
              {t('retry')}
            </Button>
          }
          secondaryAction={
            <Link href={config.routes.home} className="link">
              {t('goHome')}
            </Link>
          }
        />
      </CardContent>
    </Card>
  );
};

export default AccountError;
