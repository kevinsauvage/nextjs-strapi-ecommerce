import { cookies } from 'next/headers';

import CollectionNav from '@/app/[genre]/_components/CollectionNav/CollectionNav';
import config from '@/config';
import getClient from '@/shopify';

const Layout = async ({ children, params }) => {
  const { genre } = await params;
  const cookieStore = await cookies();
  const delegateToken = cookieStore.get('shopifyDelegateToken');
  const ip = cookieStore.get(config.cookies.userIp);

  const menu = await getClient(delegateToken?.value, ip?.value).storefront.shop.getMenu({
    handle: `collections-${genre}`,
  });

  return (
    <>
      <CollectionNav items={menu.items} />
      {children}
    </>
  );
};

export default Layout;
