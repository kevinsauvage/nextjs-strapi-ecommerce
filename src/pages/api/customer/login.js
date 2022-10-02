import { loginCustomer } from '@/lib/shopify/customer/customerApiCall';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Access token Missing');

    const data = await loginCustomer({ email, password });

    const { customerAccessToken, customerUserErrors } = data || {};

    const responseObject = {};

    if (customerUserErrors)
      responseObject.customerUserErrors = customerUserErrors;

    if (customerAccessToken) {
      responseObject.customerAccessToken = customerAccessToken;
    }

    return res.status(200).json({ ok: true, ...responseObject });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default login;
