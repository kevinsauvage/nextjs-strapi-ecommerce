/* eslint-disable camelcase */
import Stripe from 'stripe';
import { buffer } from 'micro';
import connectToDatabase from '../../../utils/mongo';

const { ObjectId } = require('mongodb');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};
const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event;

    try {
      const buf = await buffer(req);
      const sig = req.headers['stripe-signature'];

      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhook_secret
      );

      if (event.type === 'checkout.session.completed') {
        const { id, client_reference_id, amount_subtotal, payment_status } =
          event.data.object;

        const items = await stripe.checkout.sessions.listLineItems(id, {
          limit: 100,
        });

        const { db } = await connectToDatabase();

        const userCollection = await db.collection('users');

        const userObjectId = ObjectId(client_reference_id);

        const user = await userCollection.findOne({
          _id: userObjectId,
        });

        const newOrder = {
          items: items.data,
          totalPrice: amount_subtotal,
          created: event.created,
          payment_status,
        };

        const userOrders = user?.orders;

        const newOrders =
          userOrders && Array.isArray(userOrders)
            ? [...userOrders, newOrder]
            : [newOrder];

        await userCollection.updateOne(
          { _id: userObjectId },
          { $set: { orders: newOrders } }
        );
      }

      res.json({ received: true });
    } catch (err) {
      res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
  }
}
