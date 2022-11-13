import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import styles from './Navbar.module.scss';

function Navbar() {
  const navigationItems = [
    { name: 'Home', path: config.routes.home, id: 1 },
    { name: 'Collections', path: config.routes.collection, id: 2 },
    { name: 'Contact', path: config.routes.contact, id: 3 },
  ];

  return (
    <nav>
      <ul className={styles.list}>
        {Array.isArray(navigationItems) &&
          navigationItems.map((_dataUrl) => (
            <li key={_dataUrl.id}>
              <ActiveLink
                href={_dataUrl?.path}
                activeClass={styles.active}
                className={styles.item}
              >
                <a>{_dataUrl?.name}</a>
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
