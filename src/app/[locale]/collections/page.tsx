import type { Metadata } from 'next';

import CollectionGrid from '@/components/CollectionGrid/CollectionGrid';
import Link from '@/components/LocalizedLink';
import PageBanner from '@/components/PageBanner';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { contentLanguage, getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';

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
  const t = getTranslations(locale, 'collection');

  return generateMetadataUtil({
    title: t('title'),
    description: t('description'),
    url: config.routes.collection,
    locale,
  });
};

const CollectionsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'collection');
  const response = await (
    await getStorefront(locale)
  ).collections({
    language: contentLanguage(locale),
    first: 100,
    firstProducts: 1,
    identifiers: [],
    sortKey: 'TITLE',
  });

  const collections = response.collections.edges;

  return (
    <div className="pb-16 md:pb-24">
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

      <div className="container mx-auto px-4 md:px-6">
        {collections.length > 0 ? (
          <CollectionGrid collections={collections} locale={locale} preloadFeatured />
        ) : (
          <div className="rounded-[var(--radius)] border border-dashed border-border py-16 text-center">
            <h2 className="text-heading-3">{t('emptyTitle')}</h2>
            <p className="mx-auto mt-2 max-w-md px-4 text-body text-secondary">{t('emptyBody')}</p>
            <Button asChild className="mt-6">
              <Link href={config.routes.home}>{t('breadcrumbHome')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
