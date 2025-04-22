import { storefrontSdk } from '@/shopify/index';

import CollectionLayout from './_components/CollectionLayout';

type PageProperties = {
  params: Promise<{ genre: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Shop = async ({ params, searchParams }: PageProperties) => {
  const { genre } = await params;
  const searchParameters = await searchParams;

  const responseMenu = await storefrontSdk().getMenuByHandle({
    handle: `collections-${genre}`,
  });

  const collectionSlug = responseMenu?.menu?.items?.at(0)?.title;

  return <CollectionLayout collectionSlug={collectionSlug} searchParameters={searchParameters} />;
};

export default Shop;
