/* eslint-disable import/prefer-default-export */
import nookies from 'nookies';
import config from '@/config/index';

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
    query: ctx.query,
    shopifyToken: cookies?.[config?.cookies.shopifyToken],
  };
};
