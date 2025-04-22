import CollectionBanner from '@/app/[genre]/_components/CollectionBanner/CollectionBanner';
import CollectionPage from '@/app/[genre]/_components/CollectionPage/CollectionPage';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { storefrontSdk } from '@/shopify';
import { adjustPaginationVariables } from '@/shopify/helpers';
import type { ProductFilter } from '@/shopify/storefront';
import { ProductCollectionSortKeys } from '@/shopify/storefront';

const parseFiltersQuery = (filters: string | Array<string> | undefined): ProductFilter[] => {
  if (!filters) return [];

  if (!Array.isArray(filters) && typeof filters === 'string') {
    const [, jsonPart] = filters.split(/:(.+)/);
    return [JSON.parse(jsonPart) as ProductFilter];
  }

  return filters
    .map((item): ProductFilter | undefined => {
      const [, jsonPart] = item.split(/:(.+)/);
      if (!jsonPart) return undefined;
      return JSON.parse(jsonPart) as ProductFilter;
    })
    .filter((filter): filter is ProductFilter => filter !== undefined);
};

const CollectionLayout = async ({
  collectionSlug,
  searchParameters,
}: {
  collectionSlug: string;
  searchParameters: {
    after?: string;
    before?: string;
    filters?: string;
    sort_key?: string;
    reverse?: boolean;
  };
}) => {
  const sortKey = Object.keys(ProductCollectionSortKeys).find(
    (key) => key.toLowerCase() === searchParameters.sort_key?.toLowerCase(),
  ) as keyof typeof ProductCollectionSortKeys;

  const response = await storefrontSdk().collection({
    filters: parseFiltersQuery(searchParameters?.filters),
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
      first: 10,
      last: 10,
      reverse: searchParameters.reverse,
    }),
    handle: collectionSlug,
    identifiers: [],
    sortKey: ProductCollectionSortKeys[sortKey] || ProductCollectionSortKeys.BestSelling,
  });

  const { title, description } = response.collection || {};

  return (
    <div>
      <Breadcrumbs lastElement={title} />
      <CollectionBanner title={title} description={description} />
      <CollectionPage collection={response.collection} searchParameters={searchParameters} />
    </div>
  );
};

export default CollectionLayout;
