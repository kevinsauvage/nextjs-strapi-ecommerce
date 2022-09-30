import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Loader from '@/layout/Loader/Loader';
import styles from './Page.module.scss';

export default function Page({ children, title, loading }) {
  return (
    <div className={styles.page}>
      <Head>
        <title>{title}</title>
      </Head>
      {loading && <Loader />}
      <div className={styles.banner}>
        <h1 className={styles.title}>{title}</h1>
        <Breadcrumbs />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
}
