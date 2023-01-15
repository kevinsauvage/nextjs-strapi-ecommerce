import { MdOutlineLogout } from 'react-icons/md';
import { useRouter } from 'next/router';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Loader from '@/components/_loaders/Loader/Loader';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import useUserContext from 'src/contexts/UserContext/useUserContext';
import styles from './AccountLayout.module.scss';

function AccountLayout({ children, loading, title }) {
  const { logout } = useUserContext();

  return (
    <div className={styles.AccountLayout}>
      <div className={styles.banner}>
        <h1 className={styles.title}>{title}</h1>
        <button type="button" className={styles.logOut} onClick={logout}>
          <p>Logout</p>
          <MdOutlineLogout />
        </button>
      </div>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {config?.accountNav?.map((item) => (
              <li className={styles.listItem} key={item.title}>
                <ActiveLink url={item.url} scroll={false}>
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
    </div>
  );
}

export default AccountLayout;
