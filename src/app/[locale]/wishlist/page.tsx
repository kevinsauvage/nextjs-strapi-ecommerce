import type { Metadata } from 'next';

import PageBanner from '@/components/PageBanner';
import { getSeo } from '@/data/seo';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

import WishlistContent from './_components/WishlistContent';

/**
 * Customer-specific: this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    description: getSeo(locale).wishlist.description,
    title: getSeo(locale).wishlist.title,
    url: '/wishlist',
    // The list lives in per-browser storage (localStorage), so the page has no
    // server-rendered content worth indexing; robots.ts disallows it as well.
    noindex: true,
    locale,
  });
};

const WishlistPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'wishlist');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <PageBanner
        eyebrow={t('bannerEyebrow')}
        title={t('bannerTitle')}
        description={t('bannerDescription')}
        className="w-full rounded-[var(--radius)]"
      />
      <div className="mt-8">
        <WishlistContent />
      </div>
    </div>
  );
};

export default WishlistPage;
