import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';
import getClient from '@/shopify/index';

export default function CollectionSlugPage(props) {
  return <CollectionPage {...props} />;
}

CollectionSlugPage.getLayout = function getLayout(page) {
  return (
    <CollectionProvider {...page.props}>
      <CollectionLayout collection={page.props.collection}>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { delegateToken, ip, startCursor, sortKey, collectionSlug, query } = getInfoFromCtx(ctx);
  const data = await getClient().collection.filterCollectionForward(
    collectionSlug,
    16,
    [],
    sortKey,
    startCursor,
    delegateToken,
    ip
  );
  const menu = await getClient().shop.getMenu(`collections-${query.genre}`, delegateToken, ip);

  return { props: { ...data, menu } };
}
