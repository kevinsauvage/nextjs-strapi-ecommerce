// eslint-disable-next-line import/prefer-default-export
export const getIpFromRequest = (req) =>
  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
