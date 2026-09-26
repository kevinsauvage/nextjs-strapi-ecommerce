'use server';

import config from '@/config';
import { getUserFeedback, type UserFeedback } from '@/data/userFeedback';
import { getCurrentLocale, redirectToPath } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { getClientIp } from '@/lib/server/client-ip';
import { isRateLimited } from '@/lib/server/rate-limit';
import { clearShopifyToken, getShopifyToken } from '@/lib/server/shopify-helpers';
import { AuthService } from '@/services/auth.service';
import { storefrontSdk } from '@/shopify';
import type { FormState } from '@/types/formActions';
import {
  formError,
  formSuccess,
  serviceErrorsToFormState,
  zodErrorsToFormState,
} from '@/utils/form-actions';
import { isAllowedPasswordResetUrl, RESET_URL_MAX_LENGTH, safeInternalPath } from '@/utils/url';
import { emailField, nameField, passwordField } from '@/utils/validation';

import { z } from 'zod';

const tooManyAttempts = (feedback: UserFeedback): FormState =>
  formError(feedback.rateLimit.attempts);

const getRegisterSchema = (feedback: UserFeedback) =>
  z
    .object({
      email: emailField,
      firstName: nameField,
      lastName: nameField,
      password: passwordField,
      passwordConfirm: passwordField,
    })
    .superRefine(({ passwordConfirm, password }, context) => {
      if (passwordConfirm !== password) {
        context.addIssue({
          code: 'custom',
          message: feedback.passwordDifferent,
          path: ['passwordConfirm'],
        });
      }
    });

type RegisterInput = z.infer<ReturnType<typeof getRegisterSchema>>;

export async function registerAction(input: RegisterInput): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = getRegisterSchema(feedback).safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const { email, password, firstName, lastName } = result.data;

  const ip = await getClientIp();
  if (await isRateLimited('auth:register', ip, 5, '10 m', { failClosed: true })) {
    return tooManyAttempts(feedback);
  }

  const serviceResult = await AuthService.register(
    { email, password, firstName, lastName },
    feedback,
  );

  const errorState = serviceErrorsToFormState(serviceResult, feedback.createAccountFailed);
  if (errorState) return errorState;

  redirectToPath(config.routes.account, await getCurrentLocale());
}

const loginSchema = z.object({
  email: emailField,
  password: passwordField,
  redirectUrl: z.string().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

export async function loginAction(input: LoginInput): Promise<FormState> {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const { email, password, redirectUrl } = result.data;

  const ip = await getClientIp();
  // Two buckets: per-target (ip:email) and a global per-IP cap. The latter stops
  // credential stuffing / spraying across many different emails from one host.
  // The email is normalized so casing/whitespace variants share one bucket.
  const [targetLimited, ipLimited] = await Promise.all([
    isRateLimited('auth:login', `${ip}:${email.trim().toLowerCase()}`, 5, '10 m', {
      failClosed: true,
    }),
    isRateLimited('auth:login:ip', ip, 30, '10 m', { failClosed: true }),
  ]);
  if (targetLimited || ipLimited) {
    return tooManyAttempts(feedback);
  }

  const serviceResult = await AuthService.login({ email, password }, feedback);

  const errorState = serviceErrorsToFormState(serviceResult, feedback.invalidCredentials);
  if (errorState) return errorState;

  const destination = safeInternalPath(redirectUrl, config.routes.account);

  redirectToPath(destination, await getCurrentLocale());
}

const recoverSchema = z.object({
  email: emailField,
});

type RecoverPasswordInput = z.infer<typeof recoverSchema>;

export const recoverPasswordAction = async (input: RecoverPasswordInput): Promise<FormState> => {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = recoverSchema.safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const ip = await getClientIp();
  const [targetLimited, ipLimited] = await Promise.all([
    isRateLimited('auth:recover', `${ip}:${result.data.email.trim().toLowerCase()}`, 3, '15 m', {
      failClosed: true,
    }),
    isRateLimited('auth:recover:ip', ip, 10, '15 m', { failClosed: true }),
  ]);
  if (targetLimited || ipLimited) {
    return tooManyAttempts(feedback);
  }

  const serviceResult = await AuthService.recoverPassword({ email: result.data.email });

  const errorState = serviceErrorsToFormState(serviceResult, feedback.recoverFailed);
  if (errorState) return errorState;

  return formSuccess(feedback.sendRecoverEmail.success);
};

const getResetSchema = (feedback: UserFeedback) =>
  z.object({
    password: z
      .string()
      .min(8, { message: feedback.passwordLength })
      .max(128, { message: feedback.passwordLength }),
    resetUrl: z
      .string()
      .url({ message: feedback.invalidResetLink })
      .max(RESET_URL_MAX_LENGTH, { message: feedback.invalidResetLink })
      .refine(isAllowedPasswordResetUrl, { message: feedback.invalidResetLink }),
  });

type ResetPasswordInput = z.infer<ReturnType<typeof getResetSchema>>;

export const resetPasswordAction = async (input: ResetPasswordInput): Promise<FormState> => {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = getResetSchema(feedback).safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const { password, resetUrl } = result.data;

  const ip = await getClientIp();
  if (await isRateLimited('auth:reset', ip, 5, '15 m', { failClosed: true })) {
    return tooManyAttempts(feedback);
  }

  const serviceResult = await AuthService.resetPassword(
    { password, resetToken: resetUrl },
    feedback,
  );

  const errorState = serviceErrorsToFormState(serviceResult, feedback.resetPassword.error);
  if (errorState) return errorState;

  redirectToPath(config.routes.account, await getCurrentLocale());
};

const getActivateSchema = (feedback: UserFeedback) =>
  z.object({
    password: z
      .string()
      .min(8, { message: feedback.passwordLength })
      .max(128, { message: feedback.passwordLength }),
    activationUrl: z
      .string()
      .url({ message: feedback.invalidActivationLink })
      .max(RESET_URL_MAX_LENGTH, { message: feedback.invalidActivationLink })
      // Activation links are Shopify-hosted account URLs with the same shape as
      // password-reset links, so they share the store-origin allowlist.
      .refine(isAllowedPasswordResetUrl, { message: feedback.invalidActivationLink }),
  });

type ActivateAccountInput = z.infer<ReturnType<typeof getActivateSchema>>;

export const activateAccountAction = async (input: ActivateAccountInput): Promise<FormState> => {
  const feedback = getUserFeedback(await getCurrentLocale());
  const result = getActivateSchema(feedback).safeParse(input);
  if (!result.success) {
    return zodErrorsToFormState(result.error);
  }

  const { password, activationUrl } = result.data;

  const ip = await getClientIp();
  if (await isRateLimited('auth:activate', ip, 5, '15 m', { failClosed: true })) {
    return tooManyAttempts(feedback);
  }

  const serviceResult = await AuthService.activate({ activationUrl, password }, feedback);

  const errorState = serviceErrorsToFormState(serviceResult, feedback.activateAccount.error);
  if (errorState) return errorState;

  redirectToPath(config.routes.account, await getCurrentLocale());
};

/**
 * Log out: revoke the customer access token, clear the session cookies and
 * redirect to the login page. Meant to be invoked as a form action.
 */
export async function logoutAction(): Promise<void> {
  const token = await getShopifyToken();

  // Clear local session cookies first so logout always succeeds, even if the
  // revocation call is unavailable. The cookies are deleted with the same
  // domain they were set with, otherwise a `Domain=` cookie would survive.
  await clearShopifyToken();

  if (token) {
    try {
      await storefrontSdk('private').customerAccessTokenDelete({
        customerAccessToken: token,
      });
    } catch (error) {
      // Surface the failure instead of swallowing it; the token expires on its own.
      reportError('logoutAction - token revocation', error);
    }
  }

  redirectToPath(config.routes.login, await getCurrentLocale());
}
