import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';

export default function CollectionSlugPage(props) {
  return <CollectionPage {...props} />;
}

CollectionSlugPage.getLayout = function getLayout(page) {
  return (
    <CollectionProvider>
      <CollectionLayout {...page.props}>{page}</CollectionLayout>;
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { delegateToken, ip, startCursor, sortKey, collectionSlug } = getInfoFromCtx(ctx);
  const data = await filterCollectionForward(collectionSlug, 16, [], sortKey, startCursor, delegateToken, ip);
  return { props: { ...data } };
}
