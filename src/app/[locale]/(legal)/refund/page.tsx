import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import seo from '@/data/seo';
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
}): Promise<Metadata> =>
  generateMetadataUtil({
    title: seo.pages.refund.title,
    description: seo.pages.refund.description,
    url: config.routes.refund,
    locale: await localeFromParams(params),
  });

const RefundPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);

  const response = await (
    await getStorefront(locale)
  ).getRefundPolicy({ language: contentLanguage(locale) });
  const refundPolicy = response.shop?.refundPolicy;

  const { title, description } = seo.pages.refund || {};
  const refundHtml = await sanitizeHtmlCached(refundPolicy?.body);

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs path={config.routes.refund} lastElement={title} />
      </PageBanner>
      <MainContent>
        {refundHtml ? (
          <div dangerouslySetInnerHTML={{ __html: refundHtml }} />
        ) : (
          <PolicyFallback locale={locale} />
        )}
      </MainContent>
    </div>
  );
};

export default RefundPage;
