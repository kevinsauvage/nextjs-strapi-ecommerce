/* eslint-disable import/prefer-default-export */
import nookies from 'nookies';

import config from '@/config/index';

const getIpAddressFromContext = (context) => {
  const forwarded = context.req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(/, /)[0];
  }
  return context.req.socket.remoteAddress;
};

export const getInfoFromContext = (context) => {
  const cookies = nookies.get(context) || {};
  return {
    delegateToken: cookies.shopifyDelegateToken,
    startCursor: context.query?.startCursor,
    sortKey: context.query?.sort_key,
    collectionSlug: context.query?.collectionSlug,
    ip: getIpAddressFromContext(context),
    query: context.query,
    shopifyToken: cookies?.[config?.cookies.shopifyToken],
  };
};

export const getSelectedFilter = (filters, query) => {
  if (!query) return [];

  return filters.reduce((accumulator, filter) => {
    const item = query[filter.id];

    if (item) {
      if (Array.isArray(item)) {
        item.forEach((queryFilter) => {
          accumulator.push({ filterId: filter.id, input: queryFilter });
        });
      } else {
        [item].forEach((queryFilter) => {
          accumulator.push({ filterId: filter.id, input: queryFilter });
        });
      }
    }
    return accumulator;
  }, []);
};

const colors = new Set([
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
]);

export const extractUniqueColorNames = (data) => {
  const colorMap = new Map();

  data.forEach((item) => {
    const color = item.label
      .toLowerCase()
      .split(' ')
      .filter((word) => colors.has(word));
    if (color.length > 0) {
      colorMap.set(color[0], { ...item, label: color[0] });
    }
  });

  return [...colorMap.values()];
};
