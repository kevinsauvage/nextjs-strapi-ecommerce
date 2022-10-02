import {
  registerCustomer,
  loginCustomer,
} from '@/lib/shopify/customer/customerApiCall';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Missing body params Missing');

    const data = await registerCustomer({ email, password });

    if (!data) {
      const error = new Error();
      error.message = 'Something went wrong';
      error.status = 404;
      throw error;
    }

    const responseObject = {};

    const { customer, userErrors } = data || {};

    if (customer?.id) {
      const dataLogin = await loginCustomer({ email, password });
      const { customerAccessToken } = dataLogin || {};
      responseObject.customerAccessToken = customerAccessToken;
      responseObject.customer = customer;
    }

    if (userErrors) {
      responseObject.userErrors = userErrors;
    }

    return res.status(200).json({ ok: true, ...responseObject });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default register;
