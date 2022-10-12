import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Loader from '@/layout/Loader/Loader';
import styles from './Page.module.scss';
import Container from '../Container/Container';

export default function Page({ children, title, loading, extraClass }) {
  return (
    <div className={`${styles.page} ${extraClass}`}>
      <Head>
        <title>{title}</title>
      </Head>
      {loading && <Loader />}
      <Container>
        <Breadcrumbs />
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
