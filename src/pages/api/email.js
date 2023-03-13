// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';

const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

const handler = async (req, res) => {
  const requestMethod = req.method;

  if (requestMethod === 'POST') {
    const { message, name, email } = req.body;

    if (!message) {
      const error = new Error();
      error.message = 'Missing message';
      return res.status(401).send({ success: false, error: 'Error API' });
    }

    if (!email) {
      const error = new Error();
      error.message = 'Missing email';
      return res.status(401).send({ success: false, error: 'Error API' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_ADDRESS, pass: EMAIL_PASSWORD },
    });

    const mailOptions = {
      from: { name, address: email },
      to: 'kevinsauvage@outlook.com',
      subject: `Request ECommerce _ {name shop}`,
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(500).json({ error: error.message || error.toString() });
    }
    return res.status(200).json({ ok: true });
  }
  return res.status(500).json({ message: 'Method not allowed' });
};

export default handler;
