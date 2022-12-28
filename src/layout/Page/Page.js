import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import PageLoader from '../Loader/PageLoader/PageLoader';
import Container from '../Container/Container';
import styles from './Page.module.scss';

export default function Page({ children, title, description, loading }) {
  const siteTitle = `${config.name} | ${title}`;

  return (
    <div className={`${styles.page}`}>
      <Head>
        <title>{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Container>
        {loading && <PageLoader />}
        <Breadcrumbs />
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
