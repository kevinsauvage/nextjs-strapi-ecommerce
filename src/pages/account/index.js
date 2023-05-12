import { useEffect, useState } from 'react';

import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import PageLayout from '@/layout/PageLayout/PageLayout';

const Account = () => {
  const { user } = useUserContext();
  const { firstName, lastName } = user || {};
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) setIsLoading(false);
    else setIsLoading(true);
  }, [user]);

  return (
    <PageLayout title={seo.account.title} description={seo.account.description}>
      <AccountLayout
        title={seo.account.title}
        loading={isLoading}
        descriptionBannerChildren={
          <p>
            Welcome{' '}
            <b>
              {firstName} {lastName}
            </b>
            , your account dashboard provides access to all of your important account information
            and features, allowing you to manage your profile and view orders. You can update
            personal information and view order history, all in one convenient place.
          </p>
        }
      />
    </PageLayout>
  );
};

export default Account;
