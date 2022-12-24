import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/scopes/account/AccountInfo/AccountInfo';
import Orders from '@/components/scopes/account/Orders/Orders';
import Card from '@/components/scopes/account/Card/Card';
import Button from '@/components/Button/Button';
import nextApiCall from '@/utils/apiNext';
import config from '@/config/index';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { actions } from '@/contexts/UserContext/UserReducer';
import Address from '@/components/scopes/account/Address/Address';
import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';

const { userFeedback } = config;

function Profile() {
  const { user, toggleLoading, dispatch } = useUserContext();
  const { push } = useRouter();

  const [orders, setOrders] = useState();
  useEffect(() => {
    setOrders(user?.orders);
  }, [user]);

  const logout = async () => {
    toggleLoading(true);
    const res = await nextApiCall.logout();
    toggleLoading(false);
    if (res?.ok) {
      dispatch({ type: actions.REMOVE_USER });
      toast.success(userFeedback.logout.success);
      return push(config.routes.home);
    }
    return toast.error(userFeedback.logout.error);
  };

  return (
    <Page title="My Profile">
      <div className={styles.Profile}>
        <div className={styles.banner}>
          <h1 className={styles.title}>
            Welcome {user?.firstName} {user?.lastName}
          </h1>
          <p className={styles.subtitle}>
            From Your Account Page You Have The Ability To View Your Recent
            Account Activity And Update Your Account Information. Just Select A
            Link Below.
          </p>
          <Button tertiary text="Log Out" onClick={logout} />
        </div>
        <main className={styles.main}>
          <div className={styles.row}>
            <Card title="Account Information">
              <AccountInfo user={user} />
            </Card>
            <Card title="Default Address">
              <Address isAccount address={user?.defaultAddress} />
              <div className={styles.button}>
                <Button
                  text="Manage addresses"
                  type="button"
                  primary
                  href={config.routes.addresses}
                />
              </div>
            </Card>
          </div>
          <Card title="Orders">
            <Orders orders={orders} />
            {orders?.length > 2 && (
              <div className={styles.button}>
                <Button
                  text="See all orders"
                  type="button"
                  primary
                  href={config.routes.orders}
                />
              </div>
            )}
          </Card>
        </main>
      </div>
    </Page>
  );
}

export default Profile;
