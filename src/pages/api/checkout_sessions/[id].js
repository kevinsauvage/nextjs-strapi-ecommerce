import Stripe from 'stripe';
import withAuth from '../../middleware/withAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect CheckoutSession ID.');
    }
    const checkoutSession = await stripe.checkout.sessions.retrieve(id);
    const items = await stripe.checkout.sessions.listLineItems(id, {
      limit: 100,
    });

    res.status(200).json({ session: checkoutSession, items });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default withAuth(handler);
