import { getUser, refreshToken } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getInfoFromRequest } from '@/helpers/index';

const refreshDelay = 2 * 60 * 60;

export default async function handler(req, res) {
  const { method } = req;
  const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);

  if (method === 'GET') {
    if (shopifyToken) {
      let token = shopifyToken?.token;
      const expires = new Date(shopifyToken.expires).getTime();
      const now = new Date().getTime();

      if (now > expires - refreshDelay) {
        const refreshRes = await refreshToken(token, delegateToken, ip);
        const accessToken = refreshRes?.customerAccessToken?.accessToken;

        if (accessToken) {
          token = accessToken;
          handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);
        }
      }

      const userRes = (await getUser(token, delegateToken, ip)) || {};
      console.log('🚀 ~ file: customer.js:28 ~ handler ~ userRes', userRes);
      const customer = userRes?.customer;
      return res.status(200).json({ customer, ok: true });
    }
    return res.status(201).json({ ok: true });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
