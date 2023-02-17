import { getInfoFromCtx } from '@/helpers/index';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import config from '@/config/index';
import nookies from 'nookies';
import getClient from '@/shopify/index';

const index = () => <PageLoader />;

export const getServerSideProps = async (ctx) => {
  const { delegateToken, ip, shopifyToken } = getInfoFromCtx(ctx);

  if (shopifyToken) {
    nookies.set(ctx, config.cookies.shopifyToken, 'delete', { maxAge: 0, path: '/' });
    await getClient().customer.deleteAccessToken(shopifyToken, delegateToken, ip);

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
