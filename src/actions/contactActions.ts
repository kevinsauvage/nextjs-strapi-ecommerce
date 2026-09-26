'use server';

import { getContactMailEnv } from '@/config/env';
import { getUserFeedback, type UserFeedback } from '@/data/userFeedback';
import { getCurrentLocale } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { getClientIp } from '@/lib/server/client-ip';
import { isRateLimited } from '@/lib/server/rate-limit';
import type { FormState } from '@/types/formActions';
import { formError, formSuccess, zodErrorsToFormState } from '@/utils/form-actions';

import nodemailer from 'nodemailer';
import { z } from 'zod';

const CONTACT_RATE_LIMIT = { key: 'contact', tokens: 5, window: '10 m' } as const;

// Email headers (subject, reply-to display name) are built from these fields:
// carriage returns / line feeds would let a sender inject extra headers
// (`Bcc:`, ...), so they are rejected at validation AND stripped when sending.
const hasLineBreak = (value: string): boolean => /[\r\n]/.test(value);

const singleLine = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();

const getContactSchema = (feedback: UserFeedback) =>
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email()
      .max(254)
      .refine((value) => !hasLineBreak(value), {
        message: feedback.contact.invalidEmail,
      }),
    message: z
      .string()
      .min(3, {
        message: feedback.contact.messageMin,
      })
      .max(255, {
        message: feedback.contact.messageMax,
      }),
    name: z
      .string()
      .trim()
      .min(3, {
        message: feedback.contact.nameMin,
      })
      .max(255, {
        message: feedback.contact.nameMax,
      })
      .refine((value) => !hasLineBreak(value), {
        message: feedback.contact.nameLineBreaks,
      }),
    // Honeypot: real visitors never fill this field.
    website: z.string().nullish(),
  });

type ContactInput = z.infer<ReturnType<typeof getContactSchema>>;

/**
 * Process-wide Gmail transporter, created once per credential set instead of
 * on every request. Keyed by credentials so a rotation (or a test env change)
 * transparently rebuilds it.
 */
let cachedTransportKey: string | null = null;
let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

const getTransporter = (from: string, pass: string) => {
  const key = `${from}\n${pass}`;
  if (!cachedTransporter || cachedTransportKey !== key) {
    cachedTransporter = nodemailer.createTransport({
      auth: { pass, user: from },
      service: 'gmail',
    });
    cachedTransportKey = key;
  }
  return cachedTransporter;
};

export const contactAction = async (input: ContactInput): Promise<FormState> => {
  const feedback = getUserFeedback(await getCurrentLocale());
  const formData = getContactSchema(feedback).safeParse(input);
  if (!formData.success) {
    return zodErrorsToFormState(formData.error);
  }

  const { name, email, message, website } = formData.data;

  // Silently accept honeypot submissions so bots do not learn they were caught.
  if (website) {
    return formSuccess(feedback.contact.sentSuccess);
  }

  const ip = await getClientIp();
  // Fail closed: this endpoint sends mail from the site's identity, so an
  // Upstash outage must deny sends rather than allow unlimited spam relay.
  if (
    await isRateLimited(
      CONTACT_RATE_LIMIT.key,
      ip,
      CONTACT_RATE_LIMIT.tokens,
      CONTACT_RATE_LIMIT.window,
      { failClosed: true },
    )
  ) {
    return formError(feedback.rateLimit.contact);
  }

  const mailConfig = getContactMailEnv();

  if (!mailConfig) {
    reportError('contactAction', new Error('Contact email is not configured'));
    return formError(feedback.contact.unavailable);
  }

  const transporter = getTransporter(mailConfig.from, mailConfig.pass);

  try {
    // Belt and braces: validation already rejects line breaks, but the values
    // below become mail headers, so strip them again at construction.
    const safeName = singleLine(name);
    await transporter.sendMail({
      from: { address: mailConfig.from, name: mailConfig.siteName },
      replyTo: { address: email, name: safeName },
      subject: `New contact message from ${safeName}`,
      text: `From: ${safeName} <${email}>\n\n${message}`,
      to: mailConfig.recipient,
    });

    return formSuccess(feedback.contact.sentSuccess);
  } catch (error) {
    reportError('contactAction', error);
    return formError(feedback.contact.sendError);
  }
};
