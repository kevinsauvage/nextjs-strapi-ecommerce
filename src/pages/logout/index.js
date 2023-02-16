import { getInfoFromCtx } from '@/helpers/index';
import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import config from '@/config/index';
import nookies from 'nookies';

const index = () => <PageLoader />;

export const getServerSideProps = async (ctx) => {
  const { delegateToken, ip, shopifyToken } = getInfoFromCtx(ctx);

  if (shopifyToken) {
    const res = await deleteAccessToken(shopifyToken, delegateToken, ip);

    if (res?.deletedCustomerAccessTokenId) {
      nookies.set(ctx, config.cookies.shopifyToken, 'delete', { maxAge: 0, path: '/' });

      return {
        redirect: { permanent: false, destination: config.routes.login },
        props: {},
      };
    }

    return {
      redirect: { permanent: false, destination: config.routes.account },
      props: {},
    };
  }

  return {
    redirect: { permanent: false, destination: config.routes.login },
    props: {},
  };
};

export default index;
