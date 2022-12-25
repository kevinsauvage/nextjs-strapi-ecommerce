import Loader from '@/components/Loader/Loader';
import Link from 'next/link';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import styles from './AccountLayout.module.scss';

function AccountLayout({ children, title, subtitle, loading, backTo }) {
  return (
    <div className={styles.AccountLayout}>
      <div className={styles.banner}>
        {backTo && (
          <Link href={backTo.href} className={styles.backTo}>
            <MdOutlineKeyboardBackspace />
            {backTo.name}
          </Link>
        )}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
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
