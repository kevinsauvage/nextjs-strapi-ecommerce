import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Container from '@/components/Container/Container';

import styles from './CollectionNav.module.scss';

function CollectionNav({ items }) {
  return (
    <div className={styles.CollectionNav}>
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
}

export default CollectionNav;
