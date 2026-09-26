import type { Metadata } from 'next';

import { getSharedWishlistProductsAction } from '@/actions/wishlistActions';
import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.png';
import EmptyState from '@/components/EmptyState';
import Link from '@/components/LocalizedLink';
import PageBanner from '@/components/PageBanner';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

/**
 * Customer-specific: this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

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
    title: 'Shared wishlist',
    description: 'A wishlist shared with you.',
    // A shared link is user-specific and not a landing page: keep it out of the
    // index while still allowing it to be opened and shared.
    noindex: true,
    locale: await localeFromParams(params),
  });

const SharedWishlistPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string | string[] }>;
}) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'wishlist');
  const { ids } = await searchParams;

  // The public action owns validation (same product-GID rule as the wishlist),
  // bounding and rate limiting, so this page cannot be abused into unbounded
  // Storefront calls. It is dynamic because the ids come from the query string.
  const products = await getSharedWishlistProductsAction(
    Array.isArray(ids) ? ids : ids ? [ids] : [],
  );

  return (
    <>
      <PageBanner
        eyebrow={t('sharedEyebrow')}
        title={t('sharedTitle')}
        description={
          products.length > 0
            ? t('sharedCount', { count: products.length })
            : t('sharedEmptyDescription')
        }
      />

      <div className="container mx-auto px-4 py-12 md:px-6">
        {products.length === 0 ? (
          <EmptyState
            variant="wishlist"
            image={NoFavoriteIllustration}
            title={t('sharedTitle')}
            subtitle={t('sharedSubtitle')}
            altText={t('sharedAlt')}
            primaryAction={
              <Button variant="default" asChild>
                <Link href={config.routes.collection}>{t('browse')}</Link>
              </Button>
            }
          />
        ) : (
          <ProductsList layout="grid" products={products} />
        )}
      </div>
    </>
  );
};

export default SharedWishlistPage;
