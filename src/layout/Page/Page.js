import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from './Page.module.scss';
import Container from '../Container/Container';

export default function Page({ children, title, extraClass, description }) {
  return (
    <div className={`${styles.page} ${extraClass}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Container>
        <Breadcrumbs />
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
