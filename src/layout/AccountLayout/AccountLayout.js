import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { actions } from '@/contexts/UserContext/UserReducer';
import useUserContext from '@/contexts/UserContext/useUserContext';
import nextApiCall from '@/utils/apiNext';
import Loader from '@/components/Loader/Loader';
import Link from 'next/link';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import styles from './AccountLayout.module.scss';
import PageLoader from '../Loader/PageLoader/PageLoader';

function AccountLayout({ children, title, subtitle, loading, backTo }) {
  const { user, dispatch, loading: pageLoading } = useUserContext();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (user?.id) return;
        const res = await nextApiCall.getCustomer();
        if (res && res?.customer?.id) {
          dispatch({ type: actions.ADD_USER, payload: res.customer });
        } else throw new Error();
      } catch (e) {
        toast.error('Something went wrong, please try again later');
      }
    };
    fetchAddresses();
  }, [dispatch, user]);

  return (
    <div className={styles.AccountLayout}>
      {pageLoading && <PageLoader />}
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
