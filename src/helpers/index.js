import nookies, { parseCookies } from 'nookies';

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

const getIpAddressFromCtx = (ctx) => {
  const forwarded = ctx.req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(/, /)[0];
  }
  return ctx.req.socket.remoteAddress;
};

export const getInfoFromCtx = (ctx) => {
  const cookies = nookies.get(ctx) || {};
  return {
    delegateToken: cookies.shopifyDelegateToken,
    startCursor: ctx.query.startCursor,
    sortKey: ctx.query.sort_key,
    collectionSlug: ctx.query.collectionSlug,
    ip: getIpAddressFromCtx(ctx),
  };
};

export const getBase64Image = (imgUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgUrl;
    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''));
    };
    img.onerror = () => reject(Error('The image could not be loaded.'));
  });
