import type { Metadata } from 'next';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';
import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

// The 404 boundary has no route params, so it renders outside the `[locale]`
// segment and uses the default language.
const t = getTranslations(DEFAULT_LOCALE, 'notFound');

export const metadata: Metadata = {
  description: t('description'),
  robots: { index: false, follow: false },
  title: t('title'),
};

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 min-h-[calc(100vh-76px)] flex items-center justify-center">
      <EmptyState
        variant="error"
        altText={t('altText')}
        image={NotFoundIllustration}
        subtitle={t('description')}
        title={t('title')}
        primaryAction={
          <Button asChild variant="default">
            <Link href={config.routes.home}>{t('goHome')}</Link>
          </Button>
        }
        secondaryAction={
          <Link href={config.routes.collection} className="link">
            {t('browse')}
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
