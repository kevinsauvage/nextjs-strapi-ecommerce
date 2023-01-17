import ActiveLink from '@/components/ActiveLink/ActiveLink';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { search } from '@/assets/svg';
import styles from './Navbar.module.scss';

function Navbar({ headerMenu, handleOver }) {
  const { toggleSearch } = useGlobalContext();

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
        <li>
          <div
            role="button"
            tabIndex={0}
            className={styles.item}
            onClick={toggleSearch}
            onKeyDown={toggleSearch}
            onMouseOver={() => toggleSearch(true)}
            onFocus={() => toggleSearch(true)}
          >
            {search}
            <p>Search</p>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
