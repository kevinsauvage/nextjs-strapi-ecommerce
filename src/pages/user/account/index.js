import Button from '@/components/Button/Button';
import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './Profile.module.scss';

function Profile() {
  const { logout, user, loading } = useUserContext();

  return (
    <Page title="My Profile" loading={loading}>
      <div className={styles.Profile}>
        <div>Email: {user?.email}</div>
        <Button onClick={logout} tertiary text="Logout" />
        <div>
          {user?.orders?.edges && user.orders?.edges.length > 0 ? (
            user.orders?.edges.map((item) => JSON.stringify(item))
          ) : (
            <div>
              <p>You didn&apos;t make any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

export default Profile;
