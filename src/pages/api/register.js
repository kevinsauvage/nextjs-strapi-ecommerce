import { setCookie } from 'nookies';
import apiRoute from '../../data/apiRoute';
import apiHelper from '../../utils/apiHelper';
import { getStrapiURL } from '../../utils/apiStrapi';

export default async (req, res) => {
  const { username, password, email } = req.body;

  if (!email || !username || !password)
    return res.status(400).send('Missing body params');

  try {
    const response = await apiHelper(
      getStrapiURL(apiRoute.strapiApi.register),
      {
        username,
        email,
        password,
      },
      'POST'
    );

    setCookie({ res }, 'jwt', response.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return res.status(200).send({ ok: true });
  } catch (e) {
    return res.status(400).send({ error: e, data: null });
  }
};
