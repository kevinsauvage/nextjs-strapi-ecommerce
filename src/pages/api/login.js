import { setCookie } from 'nookies';
import apiRoute from '../../data/apiRoute';
import apiHelper from '../../utils/apiHelper';
import { getStrapiURL } from '../../utils/apiStrapi';

export default async (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) return res.status(400).send('Missing body params');

  try {
    const response = await apiHelper(getStrapiURL(apiRoute.strapiApi.login), {
      identifier: email,
      password,
    });

    if (response && response.user && response.jwt) {
      setCookie({ res }, 'jwt', response.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      return res
        .status(200)
        .send({ data: response.user, error: null, ok: true });
    }

    return res
      .status(400)
      .send({ data: null, error: 'User not found', ok: false });
  } catch (e) {
    return res.status(400).send({ error: e, data: null, ok: false });
  }
};
