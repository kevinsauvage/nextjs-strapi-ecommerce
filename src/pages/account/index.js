import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/scopes/account/AccountInfo/AccountInfo';
import Orders from '@/components/scopes/account/Orders/Orders';
import Card from '@/components/scopes/account/Card/Card';
import Button from '@/components/Button/Button';
import config from '@/config/index';
import Address from '@/components/scopes/account/Address/Address';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import styles from './Profile.module.scss';

function Profile() {
  const { user } = useUserContext();
  const { reload } = useRouter();
  const { userFeedback } = config;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  const logout = async () => {
    setIsLoading(true);
    const res = await nextApiCall.logout();
    setIsLoading(false);
    if (res?.ok) {
      toast.success(userFeedback.logout.success);
      return reload(config.routes.home);
    }
    return toast.error(userFeedback.logout.error);
  };

  const subtitle =
    "Welcome to your customer account! Here you can view your order history, manage your addresses, and update your account information. Simply use the navigation menu to access these features and make your shopping experience more convenient. If you have any questions or need assistance, please don't hesitate to contact us. Thank you for choosing us!";

  const title = `Welcome ${user?.firstName || ''} ${user?.lastName || ''}`;

  return (
    <Page title="Account" bannerTitle={title} bannerDescription={subtitle}>
      <AccountLayout loading={isLoading}>
        <div className={styles.logOut}>
          <Button tertiary text="Log Out" onClick={logout} />
        </div>
        <div className={styles.Profile}>
          <main className={styles.main}>
            <div className={styles.row}>
              <Card title="Account Information">
                <AccountInfo user={user} />
                <div className={styles.button}>
                  <Button
                    text="Edit Account Information"
                    type="button"
                    tertiary
                    href={config.routes.updateAccount}
                  />
                </div>
              </Card>
              <Card title="Default Address">
                <Address isAccount address={user?.defaultAddress} />
                <div className={styles.button}>
                  <Button
                    text="Manage addresses"
                    type="button"
                    tertiary
                    href={config.routes.addresses}
                  />
                </div>
              </Card>
            </div>
            <Card title="Orders">
              <Orders orders={user?.orders} />
              {user?.orders.length > 0 && (
                <div className={styles.button}>
                  <Button
                    text="See all orders"
                    type="button"
                    tertiary
                    href={config.routes.orders}
                  />
                </div>
              )}
            </Card>
          </main>
        </div>
      </AccountLayout>
    </Page>
  );
}

Profile.getLayout = function getLayout(page) {
  return <UserProvider>TEST{page}</UserProvider>;
};

export default Profile;
