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
    startCursor: ctx.query?.startCursor,
    sortKey: ctx.query?.sort_key,
    collectionSlug: ctx.query?.collectionSlug,
    ip: getIpAddressFromCtx(ctx),
    query: ctx.query,
    shopifyToken: cookies?.[config?.cookies.shopifyToken],
  };
};

export const getSelectedFilter = (filters, query) => {
  if (!query) return [];

  const newFilters = filters.reduce((acc, filter) => {
    const item = query[filter.id];

    if (item) {
      if (Array.isArray(item)) {
        item.forEach((queryFilter) => {
          acc.push({ filterId: filter.id, input: queryFilter });
        });
      } else {
        [item].forEach((queryFilter) => {
          acc.push({ filterId: filter.id, input: queryFilter });
        });
      }
    }
    return acc;
  }, []);
  return newFilters;
};

const colors = [
  'black',
  'blue',
  'brown',
  'gray',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'white',
  'yellow',
  'gold',
  'silver',
  'bronze',
  'beige',
  'maroon',
  'olive',
  'navy',
  'turquoise',
  'violet',
  'indigo',
  'magenta',
  'crimson',
  'teal',
  'aquamarine',
  'chartreuse',
  'coral',
  'fuchsia',
  'khaki',
  'lavender',
  'lime',
  'mustard',
  'peach',
  'salmon',
  'sienna',
];

export const extractUniqueColorNames = (data) => {
  const colorMap = new Map();

  data.forEach((item) => {
    const color = item.label
      .toLowerCase()
      .split(' ')
      .filter((word) => colors.includes(word));
    if (color.length > 0) {
      colorMap.set(color[0], { ...item, label: color[0] });
    }
  });

  return [...colorMap.values()];
};
