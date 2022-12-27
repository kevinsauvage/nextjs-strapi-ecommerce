import Loader from '@/components/Loader/Loader';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import config from '@/config/index';
import { MdArrowForwardIos } from 'react-icons/md';
import styles from './AccountLayout.module.scss';

const navItems = [
  { url: config.routes.account, title: 'Account' },
  { url: config.routes.updateAccount, title: 'Update Account details' },
  { url: config.routes.addresses, title: 'My Addresses' },
  { url: config.routes.createAddress, title: 'Add new Address' },
  { url: config.routes.orders, title: 'My Orders' },
];

function AccountLayout({ children, loading }) {
  return (
    <div className={styles.AccountLayout}>
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
    </div>
  );
}

export default AccountLayout;
