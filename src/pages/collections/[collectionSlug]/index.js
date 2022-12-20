import {
  filterCollectionForward,
  getCollectionFilters,
} from '@/lib/shopify/collection/collectionApiCall';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import nookies from 'nookies';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import CollectionPage from '@/layout/CollectionPage/CollectionPage';

function CollectionSlugPage(props) {
  return (
    <CollectionProvider>
      <CollectionPage {...props} />
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

  const data = await filterCollectionForward(
    collectionSlug,
    10,
    filters,
    query.sort_key,
    query.startCursor,
    delegateToken,
    ip
  );

  const { collection = [], pageInfo = [] } = data || {};

  return {
    props: {
      collection,
      pageInfo,
      filters: allFilters,
    },
  };
}
