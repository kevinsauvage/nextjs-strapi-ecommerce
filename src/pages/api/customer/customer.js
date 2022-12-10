import { parseCookies, setCookie } from 'nookies';
import { getUser, refreshToken } from '@/lib/shopify/customer/customerApiCall';

const expiresIn = 24 * 60 * 60;
const refreshDelay = 2 * 60 * 60;

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const parsedCookies = parseCookies({ req });
    const shopifyTokenCookie = parsedCookies?.shopifyToken;
    const delegateToken = parsedCookies?.shopifyDelegateToken;

    const shopifyToken = shopifyTokenCookie
      ? JSON.parse(shopifyTokenCookie)
      : null;

    if (shopifyToken) {
      let token = shopifyToken?.token;
      const expires = new Date(shopifyToken.expires).getTime();
      const now = new Date().getTime();

      if (now > expires - refreshDelay) {
        const refreshRes = await refreshToken(token, delegateToken);
        const accessToken = refreshRes?.customerAccessToken?.accessToken;

        if (accessToken) {
          token = accessToken;
          const expiresDate = new Date(new Date().getTime() + expiresIn * 1000);
          const cookieValue = JSON.stringify({
            expires: expiresDate,
            token: accessToken,
          });

          setCookie({ res }, 'shopifyToken', cookieValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: expiresIn,
            path: '/',
          });
        }
      }

      const { customer } = (await getUser(token, delegateToken)) || {};

      return res.status(200).json({ customer, ok: true });
    }
    return res.status(201).json({ ok: true });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
