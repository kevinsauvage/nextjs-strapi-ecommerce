import CollectionLayout from '@/layout/CollectionLayout/CollectionLayout';
import { CollectionProvider } from '@/contexts/CollectionContext/CollectionContext';
import { getInfoFromCtx } from '@/helpers/index';
import CollectionPage from '@/components/_scopes/collection/CollectionPage/CollectionPage';
import getClient from '@/shopify/index';

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
  const { delegateToken, ip, query } = getInfoFromCtx(ctx);

  const menuSlug = `collections-${query?.genre}`;

  const menu = await getClient(delegateToken, ip).shop.getMenu({ handle: menuSlug });

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
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
    props: {},
  };
}
