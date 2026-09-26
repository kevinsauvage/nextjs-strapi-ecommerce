import { cache, Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';
import JsonLd from '@/components/JsonLd';
import ListingHeader from '@/components/ListingHeader';
import Link from '@/components/LocalizedLink';
import PageInfoPagination from '@/components/PageInfoPagination';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductsList from '@/components/ProductsList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import config from '@/config';
import { getSeo } from '@/data/seo';
import { type Locale, LOCALES } from '@/i18n/routing';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { fetchCollectionPage, getCollectionHandlesForStaticParams } from '@/lib/server/collection';
import {
  localizedCollectionDescription,
  localizedCollectionTitle,
} from '@/lib/server/localized-content';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/server/structured-data';
import { parseFiltersQuery } from '@/shopify/helpers';

import Filters from '../_components/Filters';
import Sort from '../_components/Sort';

type parametersType = { collectionSlug: string; locale: string };

type SearchParameters = {
  after?: string;
  before?: string;
  filters?: string;
  sort_key?: string;
  reverse?: boolean;
};

/**
 * Collection lookup memoized for the lifetime of a single request.
 * `generateMetadata` and the page body both need the collection; without this
 * they each issue the same Shopify round-trip. Arguments are primitives so
 * React's `cache` can dedupe them by value (the default view hits the cache).
 */
const getCollection = cache(
  async (
    locale: Locale,
    handle: string,
    sortKey: string | undefined,
    filters: string | undefined,
    after: string | undefined,
    before: string | undefined,
    reverse: boolean,
  ) => fetchCollectionPage(locale, handle, { after, before, filters, reverse, sort_key: sortKey }),
);

/** Prerender every known collection in every language, so each hero ships in its static shell. */
export async function generateStaticParams(): Promise<Array<parametersType>> {
  const handles = await getCollectionHandlesForStaticParams();

  return LOCALES.flatMap((locale) => handles.map((handle) => ({ ...handle, locale })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<parametersType>;
}): Promise<Metadata> {
  const { collectionSlug } = await params;
  const locale = await localeFromParams(params);
  const commonT = getTranslations(locale, 'common');

  const collection = await getCollection(
    locale,
    collectionSlug,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
  );

  if (!collection) {
    return generateMetadataUtil({
      ...getSeo(locale).notFound.collection,
      url: `/collections/${collectionSlug}`,
      noindex: true,
      locale,
    });
  }

  const collectionName = localizedCollectionTitle(
    collectionSlug,
    locale,
    collection.title || commonT('collection'),
  );
  const title = collection.seo?.title || collectionName;
  const description = localizedCollectionDescription(
    collectionSlug,
    locale,
    collection.seo?.description || collection.description || commonT('collection'),
  );
  const collectionImage = collection.image?.src;

  return generateMetadataUtil({
    title,
    description,
    url: `/collections/${collectionSlug}`,
    image: collectionImage,
    locale,
  });
}

/**
 * Static part of the page: JSON-LD, breadcrumb and hero. Depends only on
 * `params`, so with `generateStaticParams` it renders into the prerendered
 * shell instead of waiting on request-time `searchParams`.
 */
const CollectionHeader = async ({ params }: { params: Promise<parametersType> }) => {
  const { collectionSlug } = await params;
  const locale = await localeFromParams(params);
  const commonT = getTranslations(locale, 'common');
  const t = getTranslations(locale, 'collection');

  const collection = await getCollection(
    locale,
    collectionSlug,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
  );

  // A missing collection is a real 404; an existing collection with no matching
  // products is an empty state (handled in the products section), not a 404.
  if (!collection) {
    notFound();
  }

  const collectionName = localizedCollectionTitle(
    collectionSlug,
    locale,
    collection.title || commonT('collection'),
  );
  const collectionImage = collection.image;
  const basePath: `/collections/${string}` = `${config.routes.collection}/${collectionSlug}`;

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: collectionName,
            description: collection.description,
            url: basePath,
          }),
          breadcrumbJsonLd([
            // Breadcrumb labels are read by search engines, so they follow the
            // rendered language like every other string on the page.
            { name: commonT('home'), url: config.routes.home },
            { name: t('title'), url: config.routes.collection },
            { name: collectionName, url: basePath },
          ]),
        ]}
      />
      {/* Breadcrumb bar */}
      <div className="border-b border-border/60 bg-secondary/30">
        <div className="container mx-auto px-4 py-3 md:px-6">
          <Breadcrumbs path={basePath} lastElement={collectionName} locale={locale} />
        </div>
      </div>

      {/* Hero */}
      {collectionImage?.src ? (
        <section className="relative isolate overflow-hidden">
          <div className="relative h-[40vh] min-h-[300px] w-full md:h-[52vh] md:min-h-[420px]">
            <Image
              src={collectionImage.large || collectionImage.src}
              alt={collectionImage.altText || collection.title || commonT('collectionImage')}
              fill
              preload
              quality={80}
              sizes="100vw"
              placeholder={collectionImage.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={collectionImage.blurDataURL || undefined}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-10 md:px-6 md:pb-14">
              <span className="text-eyebrow text-white/80">{commonT('collection')}</span>
              <h1 className="mt-3 max-w-3xl text-white">{collectionName}</h1>
              {collection.description ? (
                <p className="mt-4 max-w-2xl text-body-lg text-white/85">
                  {collection.description}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-border/60">
          <div className="container mx-auto px-4 py-14 text-center md:px-6 md:py-20">
            <span className="text-eyebrow">{commonT('collection')}</span>
            <h1 className="mt-4 text-balance">{collectionName}</h1>
            {collection.description ? (
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-body-lg text-secondary">
                {collection.description}
              </p>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
};

/**
 * Request-time part of the page: sort/filter toolbar, product grid, pagination.
 * Reads `searchParams`, so it streams in while the header above stays static.
 */
const CollectionProducts = async ({
  params,
  searchParams,
}: {
  params: Promise<parametersType>;
  searchParams?: Promise<SearchParameters>;
}) => {
  const { collectionSlug } = await params;
  const locale = await localeFromParams(params);
  const commonT = getTranslations(locale, 'common');
  const t = getTranslations(locale, 'collection');
  const searchParameters = (await searchParams) || {};

  const collection = await getCollection(
    locale,
    collectionSlug,
    searchParameters.sort_key,
    searchParameters.filters,
    searchParameters.after || undefined,
    searchParameters.before || undefined,
    searchParameters.reverse || false,
  );

  if (!collection) {
    notFound();
  }

  const collectionName = localizedCollectionTitle(
    collectionSlug,
    locale,
    collection.title || commonT('collection'),
  );

  const { products } = collection;
  const { filters, pageInfo, edges } = products || {};

  const basePath: `/collections/${string}` = `${config.routes.collection}/${collectionSlug}`;

  const safeFilters = filters || [];
  const safePageInfo = pageInfo || {
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
  };
  const safeSearchParameters = {
    after: searchParameters.after,
    before: searchParameters.before,
    filters: searchParameters.filters,
    sort_key: searchParameters.sort_key,
  };

  const safeEdges = edges ?? [];
  const pageCount = safeEdges.length;
  const activeFilterCount = parseFiltersQuery(searchParameters.filters).length;

  const sortingOptions = [
    {
      label: t('bestSelling'),
      name: 'BEST_SELLING',
    },
    {
      label: t('relevance'),
      name: 'RELEVANCE',
    },
    {
      label: t('priceLowToHigh'),
      name: 'PRICE',
    },
    { label: t('newArrivals'), name: 'CREATED' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {pageCount > 0 ? (
        <>
          <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-md md:top-20 md:-mx-6 md:px-6">
            <ListingHeader className="mb-0 items-center">
              <span className="text-caption-sm uppercase tracking-widest text-muted">
                {t('showing')} {pageCount}
                {safePageInfo.hasNextPage ? '+' : ''} {pageCount === 1 ? t('piece') : t('pieces')}
              </span>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 ? (
                  <Link
                    href={basePath}
                    className="link-underline text-caption-sm font-medium text-secondary"
                  >
                    {t('clearFilters')}
                  </Link>
                ) : null}
                <Sort
                  query={
                    searchParameters.sort_key ? searchParameters : { sort_key: 'BEST_SELLING' }
                  }
                  sortingOptions={sortingOptions}
                />
                <Filters filters={safeFilters} query={safeSearchParameters} />
              </div>
            </ListingHeader>
          </div>
          <h2 className="sr-only">{t('productsIn', { title: collectionName })}</h2>
          <ProductsList products={safeEdges.map((edge) => edge.node)} layout="grid" />{' '}
          <PageInfoPagination
            pageInfo={safePageInfo}
            searchParameters={safeSearchParameters}
            basePath={basePath}
          />
        </>
      ) : (
        <EmptyState
          variant="default"
          title={t('noProductsTitle')}
          subtitle={t('noProductsSubtitle')}
          altText={t('noProductsAlt')}
          primaryAction={
            <Link href={config.routes.collection}>
              <Button variant="default">{t('browseCollectionsCta')}</Button>
            </Link>
          }
          secondaryAction={
            <Link href={config.routes.home} className="link">
              {t('breadcrumbHome')}
            </Link>
          }
        />
      )}
    </div>
  );
};

const CollectionHeaderFallback = () => (
  <>
    <div className="border-b border-border/60 bg-secondary/30">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <Skeleton className="h-5 w-48" />
      </div>
    </div>
    <section className="relative isolate overflow-hidden">
      <Skeleton className="h-[40vh] min-h-[300px] w-full rounded-none bg-muted md:h-[52vh] md:min-h-[420px]" />
    </section>
  </>
);

const CollectionProductsFallback = () => (
  <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
    <div className="mb-8 flex items-center justify-between gap-4 border-b border-border/60 pb-3">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-28" />
      </div>
    </div>
    <ProductGridSkeleton />
  </div>
);

const CollectionSlugPage = ({
  params,
  searchParams,
}: {
  params: Promise<parametersType>;
  searchParams?: Promise<SearchParameters>;
}) => (
  <div className="pb-16 md:pb-24">
    <Suspense fallback={<CollectionHeaderFallback />}>
      <CollectionHeader params={params} />
    </Suspense>
    <Suspense fallback={<CollectionProductsFallback />}>
      <CollectionProducts params={params} searchParams={searchParams} />
    </Suspense>
  </div>
);

export default CollectionSlugPage;
