import type { GetMenuByHandleQuery } from '@/shopify/storefront';

import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Container from '@/components/Container/Container';

import styles from './CollectionNav.module.scss';

const CollectionNav = ({ items }: { items: GetMenuByHandleQuery['menu']['items'] | undefined }) => (
  <div className={styles.nav}>
    <Container>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {Array.isArray(items) &&
            items.map(
              (menuItem) =>
                typeof menuItem.url === 'string' && (
                  <li key={menuItem.id} className={styles.item}>
                    <ActiveLink activeStyle={styles.active} url={menuItem?.url}>
                      {menuItem?.title}
                    </ActiveLink>
                  </li>
                ),
            )}
        </ul>
      </nav>
    </Container>
  </div>
);

export default CollectionNav;
