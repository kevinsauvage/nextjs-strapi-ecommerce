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

  const subtitle =
    "Welcome to your customer account! Here you can view your order history, manage your addresses, and update your account information. Simply use the navigation menu to access these features and make your shopping experience more convenient. If you have any questions or need assistance, please don't hesitate to contact us. Thank you for choosing us!";

  const title = `Welcome ${user?.firstName || ''} ${user?.lastName || ''}`;

  return (
    <Page title="Account" bannerTitle={title} bannerDescription={subtitle}>
      <AccountLayout loading={isLoading}>
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
