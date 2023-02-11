import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Navbar.module.scss';

function Navbar({ headerMenu }) {
  return (
    <nav>
      <ul className={styles.list}>
        {Array.isArray(headerMenu) &&
          headerMenu.map((menuItem) => (
            <li key={menuItem.id} className={styles.item}>
              <ActiveLink activeStyle={styles.active} url={menuItem?.url}>
                {menuItem?.title}
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
