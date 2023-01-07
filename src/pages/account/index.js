import Page from '@/layout/Page/Page';
import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/scopes/account/AccountInfo/AccountInfo';
import Address from '@/components/scopes/account/Address/Address';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import Section from '@/components/scopes/account/section/Section';
import styles from './Account.module.scss';

function Account() {
  const { user } = useUserContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  return (
    <Page title="Account">
      <AccountLayout title="My Account" loading={isLoading}>
        <main className={styles.main}>
          <Section title="Account Information">
            <AccountInfo user={user} />
          </Section>
          <Section title="Default Address">
            <Address address={user?.defaultAddress} isDefaultAddress />
          </Section>
        </main>
      </AccountLayout>
    </Page>
  );
}

export default Account;
