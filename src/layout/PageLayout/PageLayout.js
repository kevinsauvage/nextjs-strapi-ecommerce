import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import Container from '../../components/Container/Container';
import styles from './PageLayout.module.scss';

export default function PageLayout({ children, title, description }) {
  const siteTitle = `${config.name} | ${title}`;

  return (
    <div className={`${styles.page}`}>
      <Head>
        <title>{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Container>
        <Breadcrumbs />
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
