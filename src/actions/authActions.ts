'use server';

import { redirect } from 'next/navigation';

import config from '@/config';
import { userFeedback } from '@/data/userFeedback';
import { zodErrorsToFormActionResult } from '@/helpers/formActions';
import { storefrontSdk } from '@/shopify';
import type { UserError } from '@/shopify/storefront';
import type { FormActionResult } from '@/types/formActions';
import { api } from '@/utils/apiClient';
import { setShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import { z } from 'zod';

const handleUserError = (
  userError: UserError[] | undefined,
): { userErrors: UserError[] } | null => {
  if (!userError || !userError.length) {
    return null;
  }
  return { userErrors: userError };
};

const registerSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
    redirectUrl: z.string().optional(),
  })
  .superRefine(({ passwordConfirm, password }, context) => {
    if (passwordConfirm !== password) {
      context.addIssue({
        code: 'custom',
        message: userFeedback.passwordDifferent,
        path: ['passwordConfirm'],
      });
    }
  });

type RegisterInput = z.infer<typeof registerSchema>;

type RegisterFieldErrors = {
  email?: string | string[];
  firstName?: string | string[];
  lastName?: string | string[];
  password?: string | string[];
  passwordConfirm?: string | string[];
};

export async function registerAction(
  input: RegisterInput,
): Promise<FormActionResult<RegisterFieldErrors> & RegisterFieldErrors> {
  const result = registerSchema.safeParse(input);
  if (!result?.success) {
    const fieldErrors = result.error.formErrors.fieldErrors as RegisterFieldErrors;
    return { ...zodErrorsToFormActionResult(result.error), ...fieldErrors };
  }

  const { email, password, firstName, lastName } = result.data;

  const registerResponse = await storefrontSdk().customerCreate({
    input: { email, firstName, lastName, password },
  });

  const { customerUserErrors, userErrors } = registerResponse?.customerCreate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  const userErrorResult = handleUserError(userErrors);
  if (userErrorResult) {
    return { userErrors: userErrorResult.userErrors };
  }

  const dataLogin = await storefrontSdk().customerAccessTokenCreate({
    input: { email, password },
  });

  const { customerAccessToken, customerUserErrors: loginCustomerErrors } =
    dataLogin?.customerAccessTokenCreate || {};

  if (loginCustomerErrors?.length) {
    return {
      customerUserErrors: loginCustomerErrors,
    };
  }

  if (!customerAccessToken) {
    return { error: userFeedback.register.error };
  }

  await setShopifyToken(customerAccessToken);

  redirect(config.routes.account);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirectUrl: z.string().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

type LoginFieldErrors = {
  email?: string | string[];
  password?: string | string[];
};

export async function loginAction(
  input: LoginInput,
): Promise<FormActionResult<LoginFieldErrors> & LoginFieldErrors> {
  const result = loginSchema.safeParse(input);
  if (!result?.success) {
    const fieldErrors = result.error.formErrors.fieldErrors as LoginFieldErrors;
    return { ...zodErrorsToFormActionResult(result.error), ...fieldErrors };
  }

  const { email, password, redirectUrl } = result.data;

  const responsesLogin = await storefrontSdk().customerAccessTokenCreate({
    input: { email, password },
  });

  const { customerUserErrors, customerAccessToken } =
    responsesLogin?.customerAccessTokenCreate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  if (!customerAccessToken) {
    return { error: userFeedback.login.error };
  }

  await setShopifyToken(customerAccessToken);

  const userResponse = await getUser();

  try {
    await api.patch('/api/cart/buyer-identity', {
      customerAccessToken: customerAccessToken?.accessToken,
      user: userResponse,
      first: 0,
      last: 0,
      after: '',
      before: '',
    });
  } catch (error) {
    console.error('Failed to update cart buyer identity:', error);
  }

  redirect(redirectUrl || config.routes.account);
}

const recoverSchema = z.object({
  email: z.string().email(),
});

type RecoverPasswordInput = z.infer<typeof recoverSchema>;

type RecoverFieldErrors = {
  email?: string | string[];
};

export const recoverPasswordAction = async (
  input: RecoverPasswordInput,
): Promise<FormActionResult<RecoverFieldErrors> & RecoverFieldErrors> => {
  const result = recoverSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors = result.error.formErrors.fieldErrors as RecoverFieldErrors;
    return { ...zodErrorsToFormActionResult(result.error), ...fieldErrors };
  }

  const { email } = result.data;

  const recoverResponse = await storefrontSdk().customerRecover({ email });

  const { customerUserErrors } = recoverResponse?.customerRecover || {};

  return customerUserErrors?.length
    ? { customerUserErrors }
    : { success: userFeedback.sendRecoverEmail.success };
};

const resetSchema = z.object({
  password: z.string().min(8, { message: userFeedback.passwordLength }),
  resetUrl: z.string(),
});

type ResetPasswordInput = z.infer<typeof resetSchema>;

type ResetFieldErrors = {
  password?: string | string[];
};

export const resetPasswordAction = async (
  input: ResetPasswordInput,
): Promise<FormActionResult<ResetFieldErrors> & ResetFieldErrors> => {
  const result = resetSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors = result.error.formErrors.fieldErrors as ResetFieldErrors;
    return { ...zodErrorsToFormActionResult(result.error), ...fieldErrors };
  }

  const { password, resetUrl } = result.data;

  const resetResponse = await storefrontSdk().customerResetByUrl({
    password,
    resetUrl,
  });

  const { customerAccessToken, customerUserErrors } = resetResponse?.customerResetByUrl || {};

  if (customerAccessToken) {
    await setShopifyToken(customerAccessToken);
    redirect(config.routes.account);
  }

  if (customerUserErrors && customerUserErrors.length > 0) {
    return { error: customerUserErrors[0]?.message || userFeedback.resetPassword.error };
  }

  return { error: userFeedback.resetPassword.error };
};
