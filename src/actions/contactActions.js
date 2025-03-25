'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';

const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

const contactSchema = z.object({
  email: z.string().email(),
  message: z
    .string()
    .min(3, {
      message: 'Message must be at least 3 characters long',
    })
    .max(255, {
      message: 'Message must be at most 255 characters long',
    }),
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters long',
    })
    .max(255, {
      message: 'Name must be at most 255 characters long',
    }),
});

export const contactAction = async (previousFormData, data) => {
  const formData = contactSchema.safeParse(Object.fromEntries(data.entries()));
  if (!formData.success) return formData.error.formErrors.fieldErrors;

  const { name, email, message } = formData.data;

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
  } catch {
    return {
      error: 'An error occurred while sending the email',
      success: false,
    };
  }
};
