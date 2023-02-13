import { getInfoFromCtx } from '@/helpers/index';
import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import config from '@/config/index';
import nookies from 'nookies';

const index = () => <PageLoader />;

export const getServerSideProps = async (ctx) => {
  const { delegateToken, ip, shopifyToken } = getInfoFromCtx(ctx);
  const { token } = shopifyToken || {};

  if (token) {
    const res = await deleteAccessToken(token, delegateToken, ip);

    if (res?.deletedCustomerAccessTokenId) {
      nookies.set(ctx, 'shopifyToken', 'delete', { maxAge: 0, path: '/' });

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
