import Head from 'next/head';
import config from '@/config/index';
import { getMetaObject } from '@/lib/shopify/shop/shopApiCall';
import Container from '../../components/Container/Container';
import styles from './PageLayout.module.scss';

export default function PageLayout({ children, title, description }) {
  const siteTitle = `${config.name} | ${title}`;

  getMetaObject({ handle: 'test', type: 'test' });
  return (
    <div className={`${styles.page}`}>
      <Head>
        <title key="title">{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Container>
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
