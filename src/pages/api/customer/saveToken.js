import { setCookie } from 'nookies';
import { getUser } from '@/lib/shopify/customer/customerApiCall';

const saveToken = async (req, res) => {
  try {
    const { customerAccessToken } = req.body;

    if (!customerAccessToken?.accessToken) {
      const error = new Error();
      error.message = 'Access token Missing';
      error.status = 400;
      throw error;
    }

    const responseObject = {};

    const { accessToken } = customerAccessToken || {};

    if (accessToken) {
      setCookie({ res }, 'shopify_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60,
        path: '/',
      });

      const customerResponse = await getUser(accessToken);

      if (customerResponse?.customer?.id) {
        responseObject.customer = customerResponse.customer;
      }
    }

    return res.status(200).json({ ok: true, ...responseObject });
  } catch (error) {
    return res.status(error.status || 404).send({
      ok: false,
      error,
    });
  }
};

export default saveToken;
