import routes from '@/data/routes';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Navbar.module.scss';

function Navbar({ active }) {
  const navigationItems = [
    { name: 'Home', path: routes.base.home, id: 1 },
    { name: 'Collections', path: routes.base.collection, id: 2 },
    { name: 'Contact', path: routes.base.contact, id: 3 },
  ];

  return (
    <nav className={styles.navbar}>
      <ul className={styles.list}>
        {Array.isArray(navigationItems) &&
          navigationItems.map((_dataUrl) => (
            <li key={_dataUrl.id} className={styles.item}>
              <ActiveLink
                href={_dataUrl?.path}
                activeClass={`${styles.active} ${
                  active && styles.navbarActive
                }`}
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
