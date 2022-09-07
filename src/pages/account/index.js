import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Page from '@/components/Page/Page';
import { messages } from '@/config/i18n';
import { UserContext } from '@/contexts/UserContext/UserContext';
import styles from './Profile.module.scss';

function Profile({ user = {} }) {
  const { logout } = useContext(UserContext);

  return (
    <Page title="User Profile">
      <div className={styles.Profile}>
        <div>Username: {user?.username}</div>

        <div>Email: {user?.email}</div>

        <Button onClick={logout} tertiary text="Logout" />
      </div>
    </Page>
  );
}

export default Profile;

export const getStaticProps = async (ctx) => ({
  props: {
    messages: messages[ctx.locale],
    revalidate: 10, // In seconds
  },
});
