import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import { storefrontSdk } from '@/shopify';
import type { GetMenuByHandleQuery } from '@/shopify/storefront';

import CollectionNav from '../_components/CollectionNav';

const findRecursiveMenuItem = (
  items: GetMenuByHandleQuery['menu']['items'],
  collectionSlug: string,
) => {
  for (const item of items) {
    if (
      typeof item?.url === 'string' &&
      item.url.toLowerCase().includes(collectionSlug.toLowerCase())
    ) {
      return true;
    } else if (item?.items?.length) {
      const foundItem = findRecursiveMenuItem(
        item.items as GetMenuByHandleQuery['menu']['items'],
        collectionSlug,
      );
      if (foundItem) {
        return true;
      }
    }
  }
  return false;
};

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ collectionSlug: string }>;
}) => {
  const { collectionSlug } = await params;

  const responseMenu = await storefrontSdk().getMenuByHandle({
    handle: `main-menu`,
  });

  const response = await storefrontSdk().collection({
    first: 1,
    handle: collectionSlug,
    identifiers: [],
  });

  const { title, description } = response.collection || {};

  const findNavItems = () => {
    return (
      responseMenu?.menu?.items?.find((item) => {
        if (typeof item?.url === 'string') {
          return findRecursiveMenuItem(
            item.items as GetMenuByHandleQuery['menu']['items'],
            collectionSlug,
          );
        }
        return false;
      })?.items || []
    );
  };

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
        <CollectionNav collectionSlug={collectionSlug} items={findNavItems()} />
      </PageBanner>
      <div className="px-2">{children}</div>
    </div>
  );
};

export default Layout;
