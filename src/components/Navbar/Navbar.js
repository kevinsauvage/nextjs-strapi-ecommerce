'use client';

import { usePathname } from 'next/navigation';

import ActiveLink from '@/components/ActiveLink/ActiveLink';

import styles from './Navbar.module.scss';

const Navbar = ({ headerMenu }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {Array.isArray(headerMenu) &&
          headerMenu.map((menuItem) => (
            <li key={menuItem.id} className={styles.item}>
              <ActiveLink
                activeStyle={styles.active}
                isActive={pathname.split('/')[1] === new URL(menuItem?.url)?.pathname.split('/')[1]}
                url={menuItem?.url}
              >
                {menuItem?.title}
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Navbar;
