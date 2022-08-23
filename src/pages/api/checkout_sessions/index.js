import Stripe from 'stripe';
import withAuth from '../../middleware/withAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { items, user } = req.body;
      const { origin } = req.headers;

      const stripeItems = items.map((item) => {
        const formatedPrice = item.product.price.replace(',', '.').trim();
        const price = formatedPrice * 100;

        return {
          price_data: {
            currency: 'EUR',
            product_data: {
              name: item.product.name,
              description: item.product.description,
            },
            unit_amount_decimal: price.toFixed(0),
          },
          quantity: item.quantity,
        };
      });

      const stipeObject = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: stripeItems ?? [],
        client_reference_id: user.id,
        customer_email: user.email,
        success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/confirmation?success=false`,
      };

      const session = await stripe.checkout.sessions.create(stipeObject);

      res.status(200).json(session);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default withAuth(handler);
