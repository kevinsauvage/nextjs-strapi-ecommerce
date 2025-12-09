'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import { userFeedback } from '@/data/userFeedback';
import { storefrontSdk } from '@/shopify';
import type { CustomerUserError, UserError } from '@/shopify/storefront';
import { setShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import { updateCartBuyerIdentityAction } from './cartActions';

const handleUserError = (userError: UserError[] | undefined) => {
  if (!userError) return;
  if (userError?.length) {
    userError.forEach((error) => {
      throw new Error(error.message);
    });
  }
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

export async function registerAction(input: RegisterInput) {
  const result = registerSchema.safeParse(input);
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const { email, password, firstName, lastName } = result.data;

  const registerResponse = await storefrontSdk().customerCreate({
    input: { email, firstName, lastName, password },
  });

  const { customerUserErrors, userErrors } = registerResponse?.customerCreate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  handleUserError(userErrors);

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

export async function loginAction(input: LoginInput): Promise<{
  customerUserErrors?: CustomerUserError[];
  email?: string[];
  error?: string;
  password?: string[];
}> {
  const result = loginSchema.safeParse(input);
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const { email, password, redirectUrl } = result.data;

  const responsesLogin = await storefrontSdk().customerAccessTokenCreate({
    input: { email, password },
  });

  const { customerUserErrors, customerAccessToken } =
    responsesLogin?.customerAccessTokenCreate || {};

  if (customerUserErrors?.length) {
    return { customerUserErrors };
  }

  if (!customerAccessToken) return { error: userFeedback.login.error };

  await setShopifyToken(customerAccessToken);

  const userResponse = await getUser();

  await updateCartBuyerIdentityAction(customerAccessToken?.accessToken, userResponse, 0, 0, '', '');

  redirect(redirectUrl || config.routes.account);
}

const recoverSchema = z.object({
  email: z.string().email(),
});

type RecoverPasswordInput = z.infer<typeof recoverSchema>;

export const recoverPasswordAction = async (input: RecoverPasswordInput) => {
  const result = recoverSchema.safeParse(input);
  if (!result.success) return result.error.formErrors.fieldErrors;

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

export const resetPasswordAction = async (input: ResetPasswordInput) => {
  const result = resetSchema.safeParse(input);
  if (!result.success) return result.error.formErrors.fieldErrors;

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
