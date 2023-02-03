import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Navbar.module.scss';

function Navbar({ headerMenu, handleOver }) {
  return (
    <nav>
      <ul className={styles.list}>
        {Array.isArray(headerMenu) &&
          headerMenu.map((menuItem) => (
            <li
              key={menuItem.id}
              onMouseOver={() => handleOver(menuItem.items)}
              onFocus={() => handleOver(menuItem.items)}
              className={styles.item}
            >
              <ActiveLink url={menuItem?.url}>{menuItem?.title}</ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
