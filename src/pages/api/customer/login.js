import { setCookie } from 'nookies';

const expireAt = 1 * 24 * 60 * 60;

export default async (req, res) => {
  const { accessToken, expiresAt } = req.body;

  console.log(req.body, 'login body');

  if (!accessToken || !expiresAt) throw new Error('Access token Missinng');

  const date = new Date();
  date.setTime(date.getTime() + 1 * 24 * 60 * 60);
  const expires = date.toUTCString();

  try {
    setCookie({ res }, 'shopify_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expireAt,
      path: '/',
    });

    setCookie({ res }, 'shopify_token_expires', expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expireAt,
      path: '/',
    });

    return res.status(200).json({ error: 'Cookie correctly set', ok: true });
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .send({ error: 'Wrong credentials', ok: false, originalError: e });
  }
};
