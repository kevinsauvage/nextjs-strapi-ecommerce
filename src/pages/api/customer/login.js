import { setCookie } from 'nookies';

export default async (req, res) => {
  const { accessToken, expiresAt } = req.body;

  if (!accessToken || !expiresAt) throw new Error('Access token Missing');

  const expireInMilliseconds = new Date(expiresAt).getTime();

  try {
    setCookie({ res }, 'shopify_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expireInMilliseconds,
      path: '/',
    });

    setCookie({ res }, 'shopify_token_expires', expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expireInMilliseconds,
      path: '/',
    });

    return res.status(200).json({ error: 'Cookie correctly set', ok: true });
  } catch (e) {
    return res.status(404).send({ ok: false, originalError: e });
  }
};
