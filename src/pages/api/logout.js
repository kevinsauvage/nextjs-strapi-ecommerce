import { destroyCookie } from 'nookies';

export default async (req, res) => {
  destroyCookie({ res }, 'jwt', {
    path: '/',
  });

  return res.status(200).send({ ok: true });
};
