import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/account/AccountInfo/AccountInfo';
import DefaultAddress from '@/components/account/DefaultAddress/DefaultAddress';
import Orders from '@/components/account/Orders/Orders';
import Card from '@/components/account/Card/Card';
import Button from 'src/components/Button/Button';
import styles from './Profile.module.scss';

function Profile() {
  const { user, logout } = useUserContext();

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
        </div>
        <main className={styles.main}>
          <div className={styles.row}>
            <Card title="Account Information">
              <AccountInfo user={user} />
            </Card>
            <Card title="Default Address">
              <DefaultAddress defaultAddress={user?.defaultAddress} />
            </Card>
          </div>
          <Card title="Orders">
            <Orders orders={user?.orders?.edges} />
          </Card>
        </main>
      </div>
      <Button tertiary text="Log Out" onClick={logout} />
    </Page>
  );
}

export default Profile;
