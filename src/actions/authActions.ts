'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
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
        message: config.userFeedback.passwordDifferent,
        path: ['passwordConfirm'],
      });
    }
  });

export async function registerAction(previousState: unknown, data: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(data.entries()));
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

  await setShopifyToken(customerAccessToken);

  redirect(config.routes.login);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirectUrl: z.string().optional(),
});

export async function loginAction(
  previousState: unknown,
  data: FormData,
): Promise<{
  customerUserErrors?: CustomerUserError[];
  email?: string[];
  error?: string;
  password?: string[];
}> {
  const result = loginSchema.safeParse(Object.fromEntries(data.entries()));
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

  if (!customerAccessToken) return { error: config.userFeedback.login.error };

  await setShopifyToken(customerAccessToken);

  const userResponse = await getUser();

  await updateCartBuyerIdentityAction(customerAccessToken?.accessToken, userResponse, 0, 0, '', '');

  redirect(redirectUrl || config.routes.account);
}

const recoverSchema = z.object({
  email: z.string().email(),
});

export const recoverPasswordAction = async (previousStates: unknown, data: FormData) => {
  const result = recoverSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const { email } = result.data;
  console.log('🟩🟪🟦-->  ~ recoverPasswordAction ~ email:', email);

  const recoverResponse = await storefrontSdk().customerRecover({ email });

  const { customerUserErrors } = recoverResponse?.customerRecover || {};
  console.log('🟩🟪🟦-->  ~ recoverPasswordAction ~ customerUserErrors:', customerUserErrors);

  return customerUserErrors?.length
    ? { customerUserErrors }
    : { success: config.userFeedback.sendRecoverEmail.success };
};

const resetSchema = z.object({
  password: z.string().min(8, { message: config.userFeedback.passwordLength }),
  resetUrl: z.string(),
});

export const resetPasswordAction = async (previousStates: unknown, data: FormData) => {
  const result = resetSchema.safeParse(Object.fromEntries(data.entries()));
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

  if (customerUserErrors?.length) {
    return { error: customerUserErrors[0].message };
  }

  return { error: config.userFeedback.resetPassword.error };
};
