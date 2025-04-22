'use client';

import type { GetMenuByHandleQuery } from '@/shopify/storefront';
import { usePathname } from 'next/navigation';

import ActiveLink from '@/components/ActiveLink/ActiveLink';

import styles from './Navbar.module.scss';

const Navbar = ({ headerMenu }: { headerMenu: GetMenuByHandleQuery['menu']['items'] }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {Array.isArray(headerMenu) &&
          headerMenu.map(
            (menuItem) =>
              typeof menuItem?.url === 'string' && (
                <li key={menuItem.id} className={styles.item}>
                  <ActiveLink
                    activeStyle={styles.active}
                    isActive={
                      pathname.split('/')[1] === new URL(menuItem?.url)?.pathname.split('/')[1]
                    }
                    url={menuItem?.url}
                  >
                    {menuItem?.title}
                  </ActiveLink>
                </li>
              ),
          )}
      </ul>
    </nav>
  );
};

export default Navbar;
