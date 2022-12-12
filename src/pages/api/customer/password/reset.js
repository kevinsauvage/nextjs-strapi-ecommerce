import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { resetCustomerPassword } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { query } = req;
    const { password } = query;
    const { url } = query;

    if (!password || password.length < 8 || !url) {
      return res.status(400).json({
        name: 'Bad Request',
        message: 'Password and URL required',
      });
    }

    const parsedCookies = parseCookies({ req });
    const delegateToken = parsedCookies?.shopifyDelegateToken;
    const ip = getIpFromRequest(req);

    const resetRes = await resetCustomerPassword(
      password,
      url,
      delegateToken,
      ip
    );

    const accessToken = resetRes?.customerAccessToken;
    const customerUserErrors = resetRes?.customerUserErrors;
    const customer = resetRes?.customer;

    if (accessToken) {
      handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);
    }

    return res.status(200).json({ customer, customerUserErrors, ok: true });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
