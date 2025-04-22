'use client';

import { usePathname } from 'next/navigation';

import ActiveLink from '@/components/ActiveLink/ActiveLink';
import { accountNav } from '@/config';

import styles from './AccountNavigation.module.scss';

const AccountNavigation = () => {
  const currentPathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {accountNav?.map((item: { title: string; url: string }) => (
          <li className={styles['list-item']} key={item.title}>
            <ActiveLink
              url={item.url}
              activeStyle={styles.active}
              scroll
              isActive={currentPathname === item.url}
            >
              {item.title}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AccountNavigation;
