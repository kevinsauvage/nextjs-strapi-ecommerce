import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/_scopes/account/AccountInfo/AccountInfo';
import Address from '@/components/_scopes/account/Address/Address';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import styles from './Account.module.scss';

function Account() {
  const { user } = useUserContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  return (
    <PageLayout title="Account">
      <AccountLayout title="My Account" loading={isLoading}>
        <main className={styles.main}>
          <AccountInfo user={user} />
          <Address address={user?.defaultAddress} isDefaultAddress title="Default Address" />
        </main>
      </AccountLayout>
    </PageLayout>
  );
}

Account.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default Account;
