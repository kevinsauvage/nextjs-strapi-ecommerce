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
import styles from './Profile.module.scss';

const { userFeedback } = config;

function Profile() {
  const { user, toggleLoading, dispatch } = useUserContext();
  const { push } = useRouter();

  const handleManage = () => {
    push(config.routes.addresses);
  };

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
              <Address
                address={user?.defaultAddress}
                buttonText="  Manage addresses"
                handleClick={handleManage}
              />
            </Card>
          </div>
          <Card title="Orders">
            <Orders orders={user?.orders} displaySeeAllButton />
          </Card>
        </main>
      </div>
    </Page>
  );
}

export default Profile;
