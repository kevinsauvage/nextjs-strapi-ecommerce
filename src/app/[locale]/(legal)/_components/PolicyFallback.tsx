import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';
import type { Locale } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

/**
 * Shown when Shopify has no published policy for a legal page, so visitors
 * get guidance and a contact path instead of an empty card.
 */
const PolicyFallback = ({ locale }: { locale: Locale }) => {
  const t = getTranslations(locale, 'legal');

  return (
    <EmptyState
      variant="error"
      title={t('policyFallbackTitle')}
      subtitle={t('policyFallbackSubtitle')}
      altText={t('policyFallbackAlt')}
      tips={[t('policyFallbackTips.0'), t('policyFallbackTips.1')]}
      tipsLabel={t('helpfulTips')}
      primaryAction={
        <Button variant="default" asChild>
          <Link href={config.routes.contact}>{t('contact')}</Link>
        </Button>
      }
    />
  );
};

export default PolicyFallback;
