import useUserContext from '@/contexts/UserContext/useUserContext';
import AccountInfo from '@/components/_scopes/account/AccountInfo/AccountInfo';
import Address from '@/components/_scopes/account/Address/Address';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import Section from '@/components/_scopes/account/section/Section';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './Account.module.scss';

function Account() {
  const { user } = useUserContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  return (
    <PageLayout title="Account">
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
    </PageLayout>
  );
}

export default Account;
