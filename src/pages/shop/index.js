import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';

export default function Shop(props) {
  return <CollectionPage {...props} />;
}

Shop.getLayout = function getLayout(page) {
  return (
    <CollectionProvider>
      <CollectionLayout {...page.props}>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { delegateToken, ip, startCursor, sortKey } = getInfoFromCtx(ctx);
  const data = (await filterCollectionForward('all', 16, [], sortKey, startCursor, delegateToken, ip)) || {};
  return { props: { ...data } };
}
