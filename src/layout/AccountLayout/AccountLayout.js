import { MdOutlineLogout } from 'react-icons/md';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import Loader from '@/components/_loaders/Loader/Loader';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import styles from './AccountLayout.module.scss';

function AccountLayout({ children, loading }) {
  const { logout } = useUserContext();

  return (
    <div className={styles.AccountLayout}>
      <Breadcrumbs />

      <div className={styles.banner}>
        <Container>
          <h1 className={styles.title}>My Account</h1>
          <button type="button" className={styles.logOut} onClick={logout}>
            <p>Logout</p>
            <MdOutlineLogout />
          </button>
        </Container>
      </div>
      <Container>
        <main className={styles.main}>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {config?.accountNav?.map((item) => (
                <li className={styles.listItem} key={item.title}>
                  <ActiveLink url={item.url} activeStyle={styles.active} scroll={false}>
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
              children
            )}
          </section>
        </main>
      </Container>
    </div>
  );
}

export default AccountLayout;
