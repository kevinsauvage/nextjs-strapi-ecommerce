import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import styles from './Breadcrumbs.module.scss';
import Crumbs from './Crumbs';

export default function Breadcrumbs() {
  const router = useRouter();
  const t = useTranslations('link');

  const routes = [
    { Home: 'Home' },
    { Shop: 'Shop' },
    { About: 'About' },
    { Contact: 'Contact' },
    { Terms: 'Terms' },
    { Privacy: 'Privacy' },
    { Profile: 'Profile' },
    { collections: 'Collections' },
  ];

  const generateText = (text) => {
    let title = '';
    routes.forEach((route) => {
      if (text.toLowerCase() === Object.keys(route).toString().toLowerCase())
        title = t(Object.keys(route).toString());
    });
    return title || text;
  };

  function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split('?')[0];

    const asPathNestedRoutes = asPathWithoutQuery
      .split('/')
      .filter((v) => v.length > 0);

    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;
      const title = subpath.split('-').join(' ');
      return { href, title: generateText(title) };
    });

    return [{ href: '/', title: t('Home') }, ...crumblist];
  }

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    breadcrumbs.length > 1 && (
      <nav>
        <ol className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, idx) => (
            <li key={crumb.href} className={styles.item}>
              <Crumbs {...crumb} last={idx === breadcrumbs.length - 1} />
            </li>
          ))}
        </ol>
      </nav>
    )
  );
}
