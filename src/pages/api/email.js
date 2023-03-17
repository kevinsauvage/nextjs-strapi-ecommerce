// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';

const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

const handler = async (request, response) => {
  const requestMethod = request.method;

  if (requestMethod === 'POST') {
    const { message, name, email } = request.body;

    if (!message) {
      return response.status(401).send({ error: 'Error API', success: false });
    }

    if (!email) {
      return response.status(401).send({ error: 'Error API', success: false });
    }

    const transporter = nodemailer.createTransport({
      auth: { pass: EMAIL_PASSWORD, user: EMAIL_ADDRESS },
      service: 'gmail',
    });

    const mailOptions = {
      from: { address: email, name },
      subject: 'Request ECommerce _ {name shop}',
      text: message,
      to: 'kevinsauvage@outlook.com',
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return response.status(500).json({ error: error.message || error.toString() });
    }
    return response.status(200).json({ ok: true });
  }
  return response.status(500).json({ message: 'Method not allowed' });
};

export default handler;
