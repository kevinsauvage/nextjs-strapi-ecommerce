import { parseCookies } from 'nookies';

const checkoutCookiesName = 'shopifyCheckoutId';

export const getIpFromRequest = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

export const getInfoFromRequest = (req) => {
  const parsedCookies = parseCookies({ req });
  const delegateToken = parsedCookies?.shopifyDelegateToken;
  const ip = getIpFromRequest(req);
  const shopifyTokenCookie = parsedCookies?.shopifyToken;
  const checkoutId = parsedCookies?.[checkoutCookiesName];
  const shopifyToken = shopifyTokenCookie ? JSON.parse(shopifyTokenCookie) : null;
  return { shopifyToken, delegateToken, ip, checkoutId };
};
