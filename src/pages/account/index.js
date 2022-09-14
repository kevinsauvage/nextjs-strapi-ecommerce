import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Page from '@/components/Page/Page';
import { UserContext } from '@/contexts/UserContext/UserContext';
import { useTranslations } from 'next-intl';
import styles from './Profile.module.scss';

function Profile() {
  const { logout, user, loading } = useContext(UserContext);
  const t = useTranslations('page.account.profile');

  return (
    <Page title={t('title')} loading={loading}>
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
