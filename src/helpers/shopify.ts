import type { CartUserError, UserError } from '@/shopify/storefront';

export const handleUserErrors = (userError: UserError[] | CartUserError[] | undefined) => {
  if (!userError) return;
  if (userError?.length) {
    userError.forEach((error) => {
      throw new Error(error.message);
    });
  }
};
