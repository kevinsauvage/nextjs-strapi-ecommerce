import { useEffect, useState } from 'react';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import { getMenuCollection } from '@/lib/shopify/shop/shopApiCall';
import styles from './CollectionNav.module.scss';

function CollectionNav() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const getMenu = async () => {
      const res = await getMenuCollection();
      setMenu(res);
    };

    getMenu();
  }, []);

  return (
    <nav className={styles.CollectionNav}>
      <ul className={styles.menu}>
        {Array.isArray(menu) &&
          menu.map((menuItem) => (
            <li key={menuItem.id} className={styles.item}>
              <ActiveLink url={menuItem?.url}>{menuItem?.title}</ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default CollectionNav;
