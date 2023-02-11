import { useRouter } from 'next/router';
import Container from '../Container/Container';
import styles from './Breadcrumbs.module.scss';
import Crumbs from './Crumbs';

export default function Breadcrumbs({ lastElement }) {
  const router = useRouter();

  const filterCrumb = ['pages', 'reset'];

  function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split('?')[0];

    const asPathNestedRoutes = asPathWithoutQuery.split('/').filter((v) => v.length > 0);

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;
      const title = subpath.split('-').join(' ').replaceAll('_', ' ');
      return {
        href,
        title,
        isNotClickable: filterCrumb.includes(title.toLowerCase()),
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
              {breadcrumbs.map((crumb, idx) => (
                <li key={crumb.href} className={styles.item}>
                  {lastElement && idx === breadcrumbs.length - 1 ? (
                    <p>{lastElement}</p>
                  ) : (
                    <Crumbs {...crumb} last={idx === breadcrumbs.length - 1} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </div>
    )
  );
}
