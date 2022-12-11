import { parseCookies } from 'nookies';
import { getUser, refreshToken } from '@/lib/shopify/customer/customerApiCall';
import { getIpFromRequest } from '@/helpers/index';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';

const refreshDelay = 2 * 60 * 60;

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const parsedCookies = parseCookies({ req });
    const shopifyTokenCookie = parsedCookies?.shopifyToken;
    const delegateToken = parsedCookies?.shopifyDelegateToken;
    const ip = getIpFromRequest(req);

    const shopifyToken = shopifyTokenCookie
      ? JSON.parse(shopifyTokenCookie)
      : null;

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
      const customer = userRes?.customer;
      return res.status(200).json({ customer, ok: true });
    }
    return res.status(201).json({ ok: true });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
