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
      <CollectionLayout>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { delegateToken, ip, startCursor, sortKey, collectionSlug, query } = getInfoFromCtx(ctx);

  const filters = Object.keys(query).reduce((acc, key) => {
    if (key.startsWith('filter')) {
      const filter = query[key];
      if (Array.isArray(filter)) {
        filter.map((f) => acc.push(JSON.parse(f)));
      } else {
        acc.push(JSON.parse(filter));
      }
    }
    return acc;
  }, []);

  const data = await getClient(delegateToken, ip).storefront.collection.collection({
    handle: collectionSlug,
    filters,
    first: 12,
    after: startCursor,
    sort: sortKey,
  });

  const menu = await getClient(delegateToken, ip).storefront.shop.getMenu({
    handle: `collections-${query.genre}`,
  });

  return { props: { ...data, menu } };
}
