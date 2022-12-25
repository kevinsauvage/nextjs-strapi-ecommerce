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
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';

function Profile() {
  const { user, dispatch } = useUserContext();
  const { push } = useRouter();
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
      dispatch({ type: actions.REMOVE_USER });
      toast.success(userFeedback.logout.success);
      return push(config.routes.home);
    }
    return toast.error(userFeedback.logout.error);
  };

  const subtitle =
    'From here, you can manage your account and orders with ease. View and update your personal details, access your order history, and create and update your delivery addresses. Keep track of your orders and ensure accurate delivery.';

  const title = `Welcome ${user?.firstName || ''} ${user?.lastName || ''}`;

  return (
    <Page title="My Profile">
      <AccountLayout title={title} subtitle={subtitle} loading={isLoading}>
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
              {user?.orders.length > 2 && (
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

export default Profile;
