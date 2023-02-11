import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { filterCollectionForward, getCollections } from '@/lib/shopify/collection/collectionApiCall';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';
import { getMenu } from '@/lib/shopify/shop/shopApiCall';

export default function CollectionSlugPage(props) {
  getCollections(20).then((collections) => {
    console.log(collections);
  });

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
  const data = await filterCollectionForward(collectionSlug, 16, [], sortKey, startCursor, delegateToken, ip);
  const menu = await getMenu(`collections-${query.genre}`, delegateToken, ip);

  return { props: { ...data, menu } };
}
