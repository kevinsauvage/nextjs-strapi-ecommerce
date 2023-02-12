import Head from 'next/head';
import config from '@/config/index';
import styles from './PageLayout.module.scss';

export default function PageLayout({ children, title, description }) {
  const siteTitle = `${title} | ${config.name}`;

  return (
    <div className={`${styles.page}`}>
      <Head>
        <title key="title">{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className={styles.children}>{children}</div>
    </div>
  );
}
