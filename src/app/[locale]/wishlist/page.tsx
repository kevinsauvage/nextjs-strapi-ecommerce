import type { Metadata } from 'next';

import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

import WishlistContent from './_components/WishlistContent';

/**
 * Customer-specific: this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

export const metadata: Metadata = {
  description: seo.wishlist.description,
  title: seo.wishlist.title,
  // The list lives in per-browser storage (localStorage), so the page has no
  // server-rendered content worth indexing; robots.ts disallows it as well.
  robots: { index: false, follow: false },
};

// The page carries no route params (the list is client state), so the banner
// renders in the default language.
const t = getTranslations(DEFAULT_LOCALE, 'wishlist');

const WishlistPage = () => (
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

export default WishlistPage;
