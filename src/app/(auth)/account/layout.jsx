import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';

import AccountNavigation from './_components/AccountNavigation/AccountNavigation';

import styles from './layout.module.scss';

const Layout = ({ children }) => {
  return (
    <div className={styles.page}>
      <PageBanner title="My Account" />
      <Breadcrumbs />
      <Container>
        <main className={styles.main}>
          <AccountNavigation />
          <div className={styles.children}>{children}</div>
        </main>
      </Container>
    </div>
  );
};

export default Layout;
