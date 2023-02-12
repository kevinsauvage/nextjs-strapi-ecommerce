import ActiveLink from '@/components/ActiveLink/ActiveLink';
import { useRouter } from 'next/router';
import styles from './Navbar.module.scss';

function Navbar({ headerMenu }) {
  const { asPath } = useRouter();
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {Array.isArray(headerMenu) &&
          headerMenu.map((menuItem) => (
            <li key={menuItem.id} className={styles.item}>
              <ActiveLink
                activeStyle={styles.active}
                isActive={asPath.startsWith(new URL(menuItem?.url)?.pathname)}
                url={menuItem?.url}
              >
                {menuItem?.title}
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
