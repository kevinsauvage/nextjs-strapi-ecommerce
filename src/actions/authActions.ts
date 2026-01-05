'use server';

import { redirect } from 'next/navigation';

import config from '@/config';
import { userFeedback } from '@/data/userFeedback';
import { safeLogError } from '@/lib/api-responses';
import {
  handleCustomerUserErrors,
  handleUserErrors,
  zodErrorsToFormActionResult,
} from '@/lib/formActions';
import { storefrontSdk } from '@/shopify';
import type { GetCustomerQuery } from '@/shopify/storefront';
import type { FormActionResult } from '@/types/formActions';
import { api } from '@/utils/apiClient';
import { setShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import { z } from 'zod';

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

  const customerErrorResult = handleCustomerUserErrors(customerUserErrors);
  if (customerErrorResult) return customerErrorResult;

  const userErrorResult = handleUserErrors(userErrors);
  if (userErrorResult) return userErrorResult;

  const dataLogin = await storefrontSdk().customerAccessTokenCreate({
    input: { email, password },
  });

  const { customerAccessToken, customerUserErrors: loginCustomerErrors } =
    dataLogin?.customerAccessTokenCreate || {};

  const loginErrorResult = handleCustomerUserErrors(loginCustomerErrors);
  if (loginErrorResult) return loginErrorResult;

  if (!customerAccessToken) {
    return { error: userFeedback.register.error };
  }

  await setShopifyToken(customerAccessToken);

  const userResponse = await getUser();

  if (userResponse) {
    await updateCartBuyerIdentityWithRetry(customerAccessToken.accessToken, userResponse);
  }

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

  const loginErrorResult = handleCustomerUserErrors(customerUserErrors);
  if (loginErrorResult) return loginErrorResult;

  if (!customerAccessToken) {
    return { error: userFeedback.login.error };
  }

  await setShopifyToken(customerAccessToken);

  const userResponse = await getUser();

  if (userResponse) {
    await updateCartBuyerIdentityWithRetry(customerAccessToken.accessToken, userResponse);
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

  const errorResult = handleCustomerUserErrors(customerUserErrors);
  if (errorResult) return errorResult;

  return { success: userFeedback.sendRecoverEmail.success };
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

    const userResponse = await getUser();

    // Update cart buyer identity with retry logic
    if (userResponse) {
      await updateCartBuyerIdentityWithRetry(customerAccessToken.accessToken, userResponse);
    }

    redirect(config.routes.account);
  }

  const errorResult = handleCustomerUserErrors(customerUserErrors);
  if (errorResult) {
    // Extract first error message for user feedback
    const firstError = customerUserErrors?.[0]?.message;
    return { error: firstError || userFeedback.resetPassword.error };
  }

  return { error: userFeedback.resetPassword.error };
};

function isSuccessResponse(response: unknown): response is { data: unknown } {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'data' in response
  );
}

function extractErrorMessage(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'error' in response &&
    typeof (response as { error: unknown }).error === 'string'
  ) {
    return (response as { error: string }).error;
  }
  return 'Unexpected response format: missing data property';
}

async function waitForBackoff(attempt: number): Promise<void> {
  const delay = Math.min(100 * Math.pow(2, attempt - 1), 1000);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

function handleFailedAttempt(
  attempt: number,
  retries: number,
  error: unknown,
  response?: unknown,
): void {
  const isLastAttempt = attempt === retries;
  const errorMessage = error instanceof Error ? error.message : String(error);

  const context = isLastAttempt
    ? `updateCartBuyerIdentityWithRetry - failed after ${retries} attempts`
    : `updateCartBuyerIdentityWithRetry - attempt ${attempt}/${retries} failed`;
  
  safeLogError(context, response ? { error: errorMessage, response } : error);
}

async function updateCartBuyerIdentityWithRetry(
  customerAccessToken: string,
  user: GetCustomerQuery['customer'],
  retries = 3,
): Promise<void> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await api.patch('/api/cart/buyer-identity', {
        customerAccessToken,
        user,
        first: 0,
        last: 0,
        after: '',
        before: '',
      });

      if (isSuccessResponse(response)) {
        return;
      }

      lastError = new Error(extractErrorMessage(response));
      handleFailedAttempt(attempt, retries, lastError, response);

      if (attempt === retries) {
        return;
      }
    } catch (error) {
      lastError = error;
      handleFailedAttempt(attempt, retries, error);

      if (attempt === retries) {
        return;
      }
    }

    // Exponential backoff: wait 100ms, 200ms, 400ms between retries
    if (attempt < retries) {
      // eslint-disable-next-line no-await-in-loop
      await waitForBackoff(attempt - 1);
    }
  }

  // This should never be reached, but log if it does
  if (lastError) {
    safeLogError(
      'updateCartBuyerIdentityWithRetry - unexpected completion',
      lastError instanceof Error ? lastError.message : lastError,
    );
  }
}
