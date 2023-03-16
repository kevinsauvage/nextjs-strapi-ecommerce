import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Loader from '@/components/_loaders/Loader/Loader';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import config from '@/config/index';

import styles from './AccountLayout.module.scss';

const AccountLayout = ({
  children,
  loading,
  title,
  descriptionBannerChildren,
  otherBannerChildrenContenct,
}) => (
  <div className={styles['account-layout']}>
    <PageBanner title={title} />
    <Breadcrumbs />
    <Container>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {config?.accountNav?.map((item) => (
              <li className={styles['list-item']} key={item.title}>
                <ActiveLink url={item.url} activeStyle={styles.active} scroll>
                  {item.title}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
        <section className={styles.children}>
          {loading ? (
            <div className={styles.loading}>
              <Loader />
            </div>
          ) : (
            <>
              {descriptionBannerChildren && (
                <div className={styles['banner-children']}>
                  <h2>{title}</h2>
                  {descriptionBannerChildren && (
                    <div className={styles['banner-children-description']}>{descriptionBannerChildren}</div>
                  )}
                  {otherBannerChildrenContenct && (
                    <div className={styles['banner-children-other']}>{otherBannerChildrenContenct}</div>
                  )}
                </div>
              )}
              {children}
            </>
          )}
        </section>
      </main>
    </Container>
  </div>
);

export default AccountLayout;
