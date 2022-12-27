import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Image from 'next/image';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useRouter } from 'next/router';
import styles from './Navbar.module.scss';
import searchIcon from '../../../public/search.svg';

function Navbar({ headerMenu, handleOver }) {
  const { toggleSearch } = useGlobalContext();
  const { origin } = useRouter();

  console.log('🚀 ~ file: Navbar.js:12 ~ Navbar ~ origin', origin);

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
