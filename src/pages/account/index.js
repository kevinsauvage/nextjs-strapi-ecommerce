import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Page from '@/components/Page/Page';
import { UserContext } from '@/contexts/UserContext/UserContext';
import styles from './Profile.module.scss';

function Profile() {
  const { logout, user } = useContext(UserContext);

  return (
    <Page title="User Profile">
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

export const getStaticProps = async ({ locale }) => ({
  props: {},
});
