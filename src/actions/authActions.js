'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import config from '@/config';
import getClient from '@/shopify';
import { setShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import { updateCartBuyerIdentityAction } from './cartActions';

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

export async function registerAction(previousState, data) {
  const result = registerSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const { email, password, firstName, lastName } = result.data;

  const registerResponse = await getClient().storefront.customer.customerCreate({
    input: { email, firstName, lastName, password },
  });

  if (!registerResponse) return { error: true };

  if (registerResponse?.userErrors?.length) {
    return {
      error: registerResponse?.userErrors[0].message,
    };
  }

  const dataLogin = await getClient().storefront.customer.customerAccessTokenCreate({
    input: { email, password },
  });

  if (!dataLogin?.customerAccessToken) return { error: true };

  setShopifyToken(dataLogin?.customerAccessToken);

  redirect(config.routes.login);
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirectUrl: z.string().optional(),
});

export async function loginAction(previousState, data) {
  const result = loginSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result?.success) return result.error.formErrors.fieldErrors;

  const { email, password, redirectUrl } = result.data;

  const responsesLogin = await getClient().storefront.customer.customerAccessTokenCreate({
    input: { email, password },
  });

  const customerUserErrors = responsesLogin?.customerUserErrors;

  if (customerUserErrors?.length) return { error: customerUserErrors[0].message };

  const customerAccessToken = responsesLogin?.customerAccessToken?.accessToken;
  if (!customerAccessToken) return { error: config.userFeedback.login.error };
  setShopifyToken(responsesLogin?.customerAccessToken);

  const userResponse = await getUser();

  await updateCartBuyerIdentityAction(customerAccessToken, userResponse);

  redirect(redirectUrl || config.routes.account);
}

const recoverSchema = z.object({
  email: z.string().email(),
});

export const recoverPasswordAction = async (previousStates, data) => {
  const result = recoverSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const { email } = result.data;

  const recoverResponse = await getClient().storefront.customer.customerRecover({ email });

  const errors = recoverResponse?.customerUserErrors || recoverResponse?.errors;

  return errors?.length
    ? {
        error: errors[0].message,
        success: false,
      }
    : {
        success: true,
        userMessage: config.userFeedback.sendRecoverEmail.success,
      };
};

const resetSchema = z.object({
  password: z.string().min(8, { message: config.userFeedback.passwordLength }),
  resetUrl: z.string(),
});

export const resetPasswordAction = async (previousStates, data) => {
  const result = resetSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const { password, resetUrl } = result.data;

  const resetResponse = await getClient().storefront.customer.customerResetByUrl({
    password,
    resetUrl,
  });

  const accessToken = resetResponse?.customerAccessToken?.accessToken;
  const customerUserErrors = resetResponse?.customerUserErrors;

  if (accessToken) {
    await setShopifyToken(resetResponse?.customerAccessToken);
    redirect(config.routes.account);
  }

  if (customerUserErrors?.length) {
    return {
      error: customerUserErrors[0].message,
      success: false,
    };
  }

  return {
    error: config.userFeedback.resetPassword.error,
    success: false,
  };
};
