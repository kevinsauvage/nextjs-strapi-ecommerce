import { setCookie } from 'nookies';

const saveToken = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      const error = new Error();
      error.message = 'Access token Missing';
      error.status = 400;
      throw error;
    }

    if (accessToken) {
      setCookie({ res }, 'shopify_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60,
        path: '/',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(error.status || 404).send({
      ok: false,
      error,
    });
  }
};

export default saveToken;
