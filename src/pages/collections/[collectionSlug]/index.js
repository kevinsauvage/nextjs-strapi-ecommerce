import {
  filterCollectionForward,
  filterCollectionBackward,
  getCollectionFilters,
} from '@/lib/shopify/collection/collectionApiCall';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import nookies from 'nookies';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import CollectionPage from '@/layout/CollectionPage/CollectionPage';

function CollectionSlugPage({ data, filters, ...rest }) {
  return (
    <CollectionProvider
      pageInfo={data?.pageInfo}
      products={data?.products}
      filters={filters}
    >
      <CollectionPage {...rest} filters={filters} data={data} />
    </CollectionProvider>
  );
}

export default CollectionSlugPage;

export async function getServerSideProps(ctx) {
  const { params, query, req } = ctx;
  const { collectionSlug } = params || {};
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;
  const forwarded = req.headers['x-forwarded-for'];

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  const allFilters = await getCollectionFilters(
    collectionSlug,
    delegateToken,
    ip
  );

  const filteredFilters = getFiltersFromQuery(allFilters, query);
  const filters = filteredFilters.map((item) => JSON.parse(item.input));

  let data;

  if (query.direction === 'backward') {
    data = await filterCollectionBackward(
      collectionSlug,
      10,
      filters,
      query.sort_key,
      query.startCursor,
      delegateToken,
      ip
    );
  } else {
    data = await filterCollectionForward(
      collectionSlug,
      10,
      filters,
      query.sort_key,
      query.endCursor,
      delegateToken,
      ip
    );
  }

  return {
    props: {
      title: collectionSlug,
      data,
      filters: allFilters,
    },
  };
}
