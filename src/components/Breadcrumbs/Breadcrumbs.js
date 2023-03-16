import { useRouter } from 'next/router';

import Container from '../Container/Container';

import Crumbs from './Crumbs';

import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = ({ lastElement }) => {
  const router = useRouter();

  const filterCrumb = new Set(['pages', 'reset']);

  function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split('?')[0];

    const asPathNestedRoutes = asPathWithoutQuery.split('/').filter((v) => v.length > 0);

    const crumbList = asPathNestedRoutes.map((subpath, index) => {
      const href = `/${asPathNestedRoutes.slice(0, index + 1).join('/')}`;
      const title = subpath.split('-').join(' ').replaceAll('_', ' ');
      return {
        href,
        title,
        isNotClickable: filterCrumb.has(title.toLowerCase()),
      };
    });

    return [{ href: '/', title: 'Home' }, ...crumbList];
  }

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    breadcrumbs.length > 1 && (
      <div className={styles.breadcrumbs}>
        <Container>
          <nav>
            <ol className={styles.list}>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className={styles.item}>
                  {lastElement && index === breadcrumbs.length - 1 ? (
                    <p className={styles.last}>{lastElement}</p>
                  ) : (
                    <Crumbs {...crumb} last={index === breadcrumbs.length - 1} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </div>
    )
  );
};
export default Breadcrumbs;
