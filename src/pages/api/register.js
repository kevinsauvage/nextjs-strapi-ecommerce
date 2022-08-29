import { setCookie } from 'nookies';
import apiRoute from '../../data/apiRoute';
import apiHelper from '../../utils/apiHelper';
import apiCall, { getStrapiURL } from '../../utils/apiStrapi';

const errorMessage = 'Something went wrong. Please try again';

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

    if (response) {
      setCookie({ res }, 'jwt', response.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      const user = await apiCall.user.getMe(response.jwt);

      if (!user)
        res.status(200).send({
          ok: false,
          message: errorMessage,
        });

      return res.status(200).send({ ok: true, data: user });
    }

    return res.status(200).send({ ok: false, message: errorMessage });
  } catch (e) {
    return res.status(400).send({ error: e, data: null });
  }
};
