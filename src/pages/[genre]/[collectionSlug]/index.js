import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromContext } from '@/helpers/index';
import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import getClient from '@/shopify/index';

const CollectionSlugPage = (properties) => <CollectionPage {...properties} />;

export default CollectionSlugPage;

CollectionSlugPage.getLayout = function getLayout(page) {
  return (
    <CollectionProvider {...page.props}>
      <CollectionLayout>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(context) {
  const { delegateToken, ip, startCursor, sortKey, collectionSlug, query } = getInfoFromContext(context);

  const filters = Object.keys(query).reduce((accumulator, key) => {
    if (key.startsWith('filter')) {
      const filter = query[key];
      if (Array.isArray(filter)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const f of filter) accumulator.push(JSON.parse(f));
      } else {
        accumulator.push(JSON.parse(filter));
      }
    }
    return accumulator;
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
