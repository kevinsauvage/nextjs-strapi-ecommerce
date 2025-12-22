import type { CartUserError, UserError } from '@/shopify/storefront';

export const handleUserErrors = (
  userError: UserError[] | CartUserError[] | undefined,
): { userErrors: (UserError | CartUserError)[] } | null => {
  if (!userError || !userError.length) {
    return null;
  }
  return { userErrors: userError };
};
