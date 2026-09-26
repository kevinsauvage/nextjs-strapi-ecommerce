import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { contentLanguage, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';
import { sanitizeHtmlCached } from '@/utils/sanitize';

import MainContent from '../_components/MainContent';
import PolicyFallback from '../_components/PolicyFallback';

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    title: getSeo(locale).pages.subscription.title,
    description: getSeo(locale).pages.subscription.description,
    url: config.routes.subscription,
    locale,
  });
};

const SubscriptionPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);

  const response = await (
    await getStorefront(locale)
  ).getSubscriptionPolicy({ language: contentLanguage(locale) });
  const { subscriptionPolicy } = response?.shop || {};
  const { title, description } = getSeo(locale).pages.subscription;
  const subscriptionHtml = await sanitizeHtmlCached(subscriptionPolicy?.body);
  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs path={config.routes.subscription} lastElement={title} locale={locale} />
      </PageBanner>
      <MainContent>
        {subscriptionHtml ? (
          <div dangerouslySetInnerHTML={{ __html: subscriptionHtml }} />
        ) : (
          <PolicyFallback locale={locale} />
        )}
      </MainContent>
    </div>
  );
};

export default SubscriptionPage;
