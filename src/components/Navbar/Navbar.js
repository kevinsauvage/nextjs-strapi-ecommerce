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
            >
              <ActiveLink
                url={menuItem?.url}
                activeClass={styles.active}
                className={styles.item}
              >
                <span>{menuItem?.title}</span>
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
