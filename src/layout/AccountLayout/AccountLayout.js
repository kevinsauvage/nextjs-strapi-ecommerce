import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import Loader from '@/components/_loaders/Loader/Loader';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './AccountLayout.module.scss';

function AccountLayout({
  children,
  loading,
  titleBannerChildren,
  descriptionBannerChildren,
  otherBannerChildrenContenct,
}) {
  const { push } = useRouter();

  useEffect(() => {
    const shopifyToken = window.localStorage.getItem(config.localStorageKeys.checkoutIdSorageKey);
    if (!shopifyToken) push(config.routes.login);
  }, [push]);

  return (
    <div className={styles.AccountLayout}>
      <Breadcrumbs />
      <div className={styles.banner}>
        <Container>
          <h1 className={styles.title}>My Account</h1>
        </Container>
      </div>
      <Container>
        <main className={styles.main}>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {config?.accountNav?.map((item) => (
                <li className={styles.listItem} key={item.title}>
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
                {titleBannerChildren && (
                  <div className={styles.bannerChildren}>
                    <h2>{titleBannerChildren}</h2>
                    {descriptionBannerChildren && (
                      <p className={styles.bannerChildrenDescription}>{descriptionBannerChildren}</p>
                    )}
                    {otherBannerChildrenContenct && (
                      <div className={styles.bannerChildrenOther}>{otherBannerChildrenContenct}</div>
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
}

export default AccountLayout;
