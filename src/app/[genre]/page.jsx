import getClient from '@/shopify';

import CollectionLayout from './_components/CollectionLayout';

const Shop = async ({ params, searchParams }) => {
  const { genre } = await params;
  const searchParameters = await searchParams;

  const menu = await getClient().storefront.shop.getMenu({
    handle: `collections-${genre}`,
  });

  return (
    <CollectionLayout
      collectionSlug={menu?.items?.[0]?.url.split('/').pop()}
      searchParameters={searchParameters}
    />
  );
};

export default Shop;
