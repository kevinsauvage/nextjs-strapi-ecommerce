import shopifyStorefrontCall from '..';
import checkoutQueries from './checkoutQueries';

// eslint-disable-next-line import/prefer-default-export
export const associateCustomerToCheckout = async (
  checkoutId,
  customerAccessToken
) => {
  const res = await shopifyStorefrontCall(
    checkoutQueries.queryAddCustomerToCheckout,
    {
      checkoutId,
      customerAccessToken,
    }
  );
  console.log(res, 'res');
  return res?.checkoutCustomerAssociateV2;
};
