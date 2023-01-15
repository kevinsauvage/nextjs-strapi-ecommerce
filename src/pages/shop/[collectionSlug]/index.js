import nookies from 'nookies';
import CollectionPage from '@/components/CollectionPage/CollectionPage';
import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';

function CollectionSlugPage(props) {
  return <CollectionPage {...props} />;
}

export default CollectionSlugPage;

CollectionSlugPage.getLayout = function getLayout(page) {
  return (
    <CollectionProvider>
      <CollectionLayout collection={page.props.collection}>{page}</CollectionLayout>;
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { params, query, req } = ctx;
  const { collectionSlug } = params || {};
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : req.socket.remoteAddress;

  const data = await filterCollectionForward(
    collectionSlug,
    16,
    [],
    query.sort_key,
    query.startCursor,
    delegateToken,
    ip
  );

  const { collection = [], pageInfo = [], collectionFilters = [] } = data || {};

  return {
    props: {
      collection,
      pageInfo,
      filters: collectionFilters,
    },
  };
}
