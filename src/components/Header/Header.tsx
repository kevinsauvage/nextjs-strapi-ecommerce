import type { GetMenuByHandleQuery } from '@/shopify/storefront';

import Container from '@/components/Container/Container';
import Logo from '@/components/Logo/Logo';
import Navbar from '@/components/Navbar/Navbar';
import UserButtons from '@/components/UserButtons/UserButtons';
import { getShopifyToken } from '@/utils/shopify';

import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

import styles from './Header.module.scss';

const Header = async ({ headerMenu }: { headerMenu: GetMenuByHandleQuery['menu']['items'] }) => {
  const shopifyToken = await getShopifyToken();
  return (
    <header className={`${styles.header}`}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.left}>
            <HamburgerMenu headerMenu={headerMenu} shopifyToken={shopifyToken} />
            <Logo />
            <Navbar headerMenu={headerMenu} />
          </div>
          <UserButtons />
        </div>
      </Container>
    </header>
  );
};

export default Header;
