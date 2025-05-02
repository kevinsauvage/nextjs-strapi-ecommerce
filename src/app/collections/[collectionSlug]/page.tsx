import EmptyState from '@/components/EmptyState';
import ListingHeader from '@/components/ListingHeader';
import PageInfoPagination from '@/components/PageInfoPagination';
import ProductEdgeList from '@/components/ProductsEdgeList';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables, parseFiltersQuery } from '@/shopify/helpers';
import { ProductCollectionSortKeys } from '@/shopify/storefront';

import Filters from '../_components/Filters';
import Sort from '../_components/Sort';

const CollectionSlugPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ collectionSlug: string }>;
  searchParams?: Promise<{
    after?: string;
    before?: string;
    filters?: string;
    sort_key?: string;
    reverse?: boolean;
  }>;
}) => {
  const { collectionSlug } = await params;
  const searchParameters = await searchParams;

  const sortKey = Object.keys(ProductCollectionSortKeys).find(
    (key) => key.toLowerCase() === searchParameters.sort_key?.toLowerCase(),
  ) as keyof typeof ProductCollectionSortKeys;

  const response = await storefrontSdk().collection({
    filters: parseFiltersQuery(searchParameters?.filters),
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
      first: 16,
      last: 16,
      reverse: searchParameters.reverse,
    }),
    handle: collectionSlug,
    identifiers: [],
    sortKey: ProductCollectionSortKeys[sortKey] || ProductCollectionSortKeys.BestSelling,
  });

  const { products } = response.collection || {};
  const { filters, pageInfo, edges } = products || {};

  if (!edges?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Collection Not Found"
          subtitle="Please try again with another collection"
          altText="Collection Not Found"
        />
      </div>
    );
  }

  const sortingOptions = [
    {
      label: 'Best Selling',
      name: ProductCollectionSortKeys.BestSelling,
    },
    {
      label: 'Relevance',
      name: ProductCollectionSortKeys.Relevance,
    },
    {
      label: 'Price, low to high',
      name: ProductCollectionSortKeys.Price,
    },

    { label: 'New Arrivals', name: ProductCollectionSortKeys.Created },
  ];

  return (
    <div className="container mx-auto mb-8">
      <ListingHeader>
        <Sort
          query={
            searchParameters?.sort_key
              ? searchParameters
              : { sort_key: ProductCollectionSortKeys.BestSelling }
          }
          sortingOptions={sortingOptions}
        />
        <Filters filters={filters} query={searchParameters} />
      </ListingHeader>
      <ProductEdgeList products={edges} layout="grid" />
      <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
    </div>
  );
};

export default CollectionSlugPage;
