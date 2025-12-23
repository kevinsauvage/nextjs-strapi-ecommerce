import { cn } from '@/lib/utils';
import type { CustomerUserError } from '@/shopify/storefront';

import FormFieldError from './FormFieldError';

type FormErrorProps = {
  error?: string;
  customerUserErrors?: CustomerUserError[];
  userErrors?: Array<{ message: string }>;
  fallback?: string;
  className?: string;
};

const FormError = ({
  error,
  customerUserErrors,
  userErrors,
  fallback,
  className,
}: FormErrorProps) => {
  const errorMessage =
    (typeof error === 'string' && error.trim() ? error : null) ||
    (customerUserErrors && customerUserErrors.length > 0 ? customerUserErrors[0]?.message : null) ||
    (userErrors && userErrors.length > 0 ? userErrors[0]?.message : null) ||
    fallback ||
    null;

  return (
    <FormFieldError
      error={errorMessage || undefined}
      fieldId="form"
      className={cn('mt-0', className)}
    />
  );
};

export default FormError;
