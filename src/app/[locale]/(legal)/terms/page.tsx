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
    title: getSeo(locale).pages.terms.title,
    description: getSeo(locale).pages.terms.description,
    url: config.routes.terms,
    locale,
  });
};

const TermsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);

  const response = await (
    await getStorefront(locale)
  ).getTermsOfService({ language: contentLanguage(locale) });
  const { termsOfService } = response?.shop || {};
  const { title, description } = getSeo(locale).pages.terms;
  const termsHtml = await sanitizeHtmlCached(termsOfService?.body);
  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs path={config.routes.terms} lastElement={title} locale={locale} />
      </PageBanner>
      <MainContent>
        {termsHtml ? (
          <div dangerouslySetInnerHTML={{ __html: termsHtml }} />
        ) : (
          <PolicyFallback locale={locale} />
        )}
      </MainContent>
    </div>
  );
};

export default TermsPage;
