import Head from 'next/head';
import styles from './Page.module.scss';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

export default function Page({ children, title }) {
  return (
    <div className={styles.page}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.banner}>
        <h1 className={styles.title}>{title}</h1>
        <Breadcrumbs />
      </div>
      {children}
    </div>
  );
}
