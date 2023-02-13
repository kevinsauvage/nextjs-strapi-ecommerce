import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';
import { getMenu } from '@/lib/shopify/shop/shopApiCall';

export default function Shop(props) {
  return <CollectionPage {...props} />;
}

Shop.getLayout = function getLayout(page) {
  return (
    <CollectionProvider {...page.props}>
      <CollectionLayout collection={page.props.collection}>{page}</CollectionLayout>
    </CollectionProvider>
  );
};

export async function getServerSideProps(ctx) {
  const { delegateToken, ip, startCursor, sortKey, query } = getInfoFromCtx(ctx);
  const data = (await filterCollectionForward('all', 16, [], sortKey, startCursor, delegateToken, ip)) || {};
  const menuSlug = `collections-${query?.genre}`;

  const menu = await getMenu(menuSlug, delegateToken, ip);

  console.log('🚀 ~ file: index.js:25 ~ getServerSideProps ~ query?.genre', query?.genre);
  console.log('🚀 ~ file: index.js:26 ~ getServerSideProps ~ menu', menu);

  if (menu?.[0]) {
    const destination = new URL(menu[0]?.url)?.pathname;

    return {
      redirect: {
        permanent: false,
        destination,
      },
      props: {},
    };
  }

  return { props: { ...data, menu } };
}
