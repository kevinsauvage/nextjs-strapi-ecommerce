import Loader from '@/components/Loader/Loader';
import styles from './AccountLayout.module.scss';

function AccountLayout({ children, loading }) {
  return (
    <div className={styles.AccountLayout}>
      {loading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default AccountLayout;
