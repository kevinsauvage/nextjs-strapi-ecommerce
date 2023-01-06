import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Image from 'next/image';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Navbar.module.scss';
import searchIcon from '../../../public/search.svg';

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
          >
            <Image {...searchIcon} alt="search" className={styles.searchIcon} />
            Search
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
