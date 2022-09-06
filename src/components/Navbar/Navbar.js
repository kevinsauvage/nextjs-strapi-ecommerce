import { useTranslations } from 'next-intl';
import routes from '@/data/routes';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Navbar.module.scss';

function Navbar({ active }) {
  const t = useTranslations('link');

  const navigationItems = [
    { name: t('Home'), path: routes.base.home, id: 1 },
    { name: t('Shop'), path: routes.base.shop, id: 2 },
    { name: t('Collections'), path: routes.base.collection, id: 3 },
    { name: t('Contact'), path: routes.base.contact, id: 4 },
    { name: t('About'), path: routes.base.about, id: 5 },
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
