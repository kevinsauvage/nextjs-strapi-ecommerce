import { setCookie } from 'nookies';

export default async (req, res) => {
  const { accessToken, expiresAt } = req.body;

  if (!accessToken || !expiresAt) throw new Error('Access token Missinng');

  try {
    setCookie({ res }, 'shopify_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    setCookie({ res }, 'shopify_token_expires', expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60,
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
