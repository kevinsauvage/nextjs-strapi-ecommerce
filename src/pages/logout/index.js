import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import config from '@/config/index';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

function Index() {
  const { push } = useRouter();

  const handleLogout = useCallback(async () => {
    const token = window.localStorage.getItem(config.localStorageKeys.shopifyToken);
    const res = await deleteAccessToken(token);
    console.log(res, 'logged out');
    window.localStorage.removeItem(config.localStorageKeys.shopifyToken);
    push(config.routes.login);
  }, [push]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <PageLoader />;
}

export default Index;
