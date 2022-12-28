import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/scopes/account/AccountInfo/AccountInfo';
import Orders from '@/components/scopes/account/Orders/Orders';
import Card from '@/components/scopes/account/Card/Card';
import Address from '@/components/scopes/account/Address/Address';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';

function Profile() {
  const { user } = useUserContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  const title = `Welcome ${user?.firstName || ''} ${user?.lastName || ''}`;

  return (
    <Page title="Account">
      <AccountLayout title={title} loading={isLoading}>
        <main className={styles.main}>
          <div className={styles.row}>
            <Card title="Account Information">
              <AccountInfo user={user} />
            </Card>
            <Card title="Default Address">
              <Address isAccount address={user?.defaultAddress} />
            </Card>
          </div>
          <Card title="Orders">
            <Orders orders={user?.orders} />
          </Card>
        </main>
      </AccountLayout>
    </Page>
  );
}

export default Profile;
