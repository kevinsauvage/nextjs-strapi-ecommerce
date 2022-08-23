import { useTranslations } from 'next-intl';
import routes from '../../data/routes';
import ActiveLink from '../ActiveLink/ActiveLink';
import styles from './Navbar.module.scss';

function Navbar() {
  const t = useTranslations('link');

  const navigationItems = [
    { name: t('Home'), path: routes.base.home, id: 1 },
    { name: t('Shop'), path: routes.base.shop, id: 2 },
    { name: t('About'), path: routes.base.about, id: 3 },
    { name: t('Contact'), path: routes.base.contact, id: 4 },
  ];
  return (
    <nav className={styles.navbar}>
      <ul className={styles.list}>
        {Array.isArray(navigationItems) &&
          navigationItems.map((_dataUrl) => (
            <li key={_dataUrl.id} className={styles.item}>
              <ActiveLink href={_dataUrl?.path} activeClass={styles.active}>
                <a>{_dataUrl?.name}</a>
              </ActiveLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
