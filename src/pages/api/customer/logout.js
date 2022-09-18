import { destroyCookie } from 'nookies';

const logout = async (req, res) => {
  destroyCookie({ res }, 'shopify_token', {
    path: '/',
  });

  destroyCookie({ res }, 'shopify_token_expires', {
    path: '/',
  });

  return res.status(200).send({ ok: true });
};

export default logout;
