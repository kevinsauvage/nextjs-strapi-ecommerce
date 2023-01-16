import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import nookies from 'nookies';
import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import CollectionPage from '@/components/CollectionPage/CollectionPage';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';

export default function Shop(props) {
  return <CollectionPage {...props} />;
}

Shop.getLayout = function getLayout(page) {
  return (
    <CollectionProvider>
      <CollectionLayout collection={page.props.collection}>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  const { startCursor, sort_key: sortKey } = query;
  const data = (await filterCollectionForward('all', 16, [], sortKey, startCursor, delegateToken, ip)) || {};

  return { props: { ...data } };
}
