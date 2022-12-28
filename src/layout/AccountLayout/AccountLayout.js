import Loader from '@/components/Loader/Loader';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import { MdArrowForwardIos, MdOutlineLogout } from 'react-icons/md';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './AccountLayout.module.scss';

const navItems = [
  { url: config.routes.account, title: 'Account' },
  { url: config.routes.updateAccount, title: 'Update Account details' },
  { url: config.routes.addresses, title: 'My Addresses' },
  { url: config.routes.createAddress, title: 'Add new Address' },
  { url: config.routes.orders, title: 'My Orders' },
];

function AccountLayout({ children, loading, title }) {
  const { push } = useRouter();
  const { toggleLoading } = useGlobalContext();
  const { userFeedback } = config;

  const logout = async () => {
    toggleLoading(true);
    const res = await nextApiCall.logout();
    toggleLoading(false);
    if (res?.ok) {
      return push(config.routes.login);
    }
    return toast.error(userFeedback.logout.error);
  };

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
            <li className={styles.listItem}>
              {navItems.map((item) => (
                <ActiveLink
                  key={item.url}
                  url={item.url}
                  activeClass={styles.active}
                  className={styles.item}
                  scroll={false}
                >
                  <div>
                    <span>{item.title}</span>
                    <MdArrowForwardIos />
                  </div>
                </ActiveLink>
              ))}
            </li>
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
