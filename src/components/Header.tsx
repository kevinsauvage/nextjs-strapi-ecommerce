import Logo from '@/components/Logo';
import UserButtons from '@/components/UserButtons';
import type { GetMenuByHandleQuery } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';

import HamburgerMenu from './HamburgerMenu';

const Header = async ({ headerMenu }: { headerMenu: GetMenuByHandleQuery['menu']['items'] }) => {
  const shopifyToken = await getShopifyToken();
  return (
    <header className="py-4">
      <div className="container mx-auto px-4">
        <div className=" w-full flex items-center justify-between md:grid md:grid-cols-3 md:justify-items-center">
          <Logo />
          <HamburgerMenu headerMenu={headerMenu} shopifyToken={shopifyToken} />
          <UserButtons className="md:ml-auto" />
        </div>
      </div>
    </header>
  );
};

export default Header;
