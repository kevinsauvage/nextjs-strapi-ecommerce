import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import seo from '@/data/seo';
import styles from './Account.module.scss';

function Account() {
  const { user } = useUserContext();
  const { firstName, lastName } = user || {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
    else setIsLoading(true);
  }, [user]);

  return (
    <PageLayout title={seo.account.title} description={seo.account.description}>
      <AccountLayout title="My Account" loading={isLoading}>
        <main className={styles.main}>
          <div className={styles.content}>
            <h2>Welcome to you account</h2>
            <p className={styles.subtitle}>
              Welcome{' '}
              <b>
                {firstName} {lastName}
              </b>
              , your account dashboard provides access to all of your important account information and
              features, allowing you to manage your profile and view orders. You can update personal
              information and view order history, all in one convenient place.
            </p>
          </div>
        </main>
      </AccountLayout>
    </PageLayout>
  );
}

export default Account;
