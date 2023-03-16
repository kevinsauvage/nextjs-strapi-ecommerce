import nookies from 'nookies';

import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import config from '@/config/index';
import { getInfoFromContext } from '@/helpers/index';
import getClient from '@/shopify/index';

const index = () => <PageLoader />;

export const getServerSideProps = async (context) => {
  const { delegateToken, ip, shopifyToken } = getInfoFromContext(context);

  if (shopifyToken) {
    nookies.set(context, config.cookies.shopifyToken, 'delete', { maxAge: 0, path: '/' });
    await getClient(delegateToken, ip).storefront.customer.customerAccessTokenDelete({
      customerAccessToken: shopifyToken,
    });

    return {
      redirect: { permanent: false, destination: config.routes.login },
      props: {},
    };
  }

  return {
    redirect: { permanent: false, destination: config.routes.account },
    props: {},
  };
};

export default index;
