import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import MainContent from '@/app/[locale]/(legal)/_components/MainContent';
import PolicyFallback from '@/app/[locale]/(legal)/_components/PolicyFallback';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import type { Locale } from '@/i18n/routing';
import { contentLanguage, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';
import { sanitizeHtmlCached } from '@/utils/sanitize';

type PagesParams = {
  handle: string;
  locale: string;
};

/** Shopify page handles are lowercase slugs (`about-us`); anything else 404s. */
const isValidPageHandle = (handle: string): boolean => /^[a-z0-9][a-z0-9-]*$/.test(handle);

const getPage = async (handle: string, locale: Locale) => {
  if (!isValidPageHandle(handle)) return null;

  const response = await (
    await getStorefront(locale)
  ).getPageByHandle({ handle, language: contentLanguage(locale) });
  return response?.page ?? null;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<PagesParams>;
}): Promise<Metadata> => {
  const { handle } = await params;
  const locale = await localeFromParams(params);
  const page = await getPage(handle, locale);

  if (!page) return {};

  return generateMetadataUtil({
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    url: `${config.routes.page}/${page.handle}`,
    locale,
  });
};

const ShopifyPage = async ({ params }: { params: Promise<PagesParams> }) => {
  const { handle } = await params;
  const locale = await localeFromParams(params);
  const page = await getPage(handle, locale);

  if (!page) {
    notFound();
  }

  const pageHtml = await sanitizeHtmlCached(page.body);

  return (
    <div>
      <PageBanner title={page.title} description={page.bodySummary}>
        <Breadcrumbs
          path={`${config.routes.page}/${handle}`}
          lastElement={page.title}
          locale={locale}
        />
      </PageBanner>
      <MainContent>
        {pageHtml ? (
          <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
        ) : (
          <PolicyFallback locale={locale} />
        )}
      </MainContent>
    </div>
  );
};

export default ShopifyPage;
