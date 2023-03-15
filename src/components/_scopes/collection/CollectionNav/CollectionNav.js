import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Container from '@/components/Container/Container';

import styles from './CollectionNav.module.scss';

const CollectionNav = ({ items }) => (
  <div className={styles.nav}>
    <Container>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {Array.isArray(items) &&
            items.map((menuItem) => (
              <li key={menuItem.id} className={styles.item}>
                <ActiveLink activeStyle={styles.active} url={menuItem?.url}>
                  {menuItem?.title}
                </ActiveLink>
              </li>
            ))}
        </ul>
      </nav>
    </Container>
  </div>
);

export default CollectionNav;
