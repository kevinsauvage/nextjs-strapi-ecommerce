import { useEffect } from 'react';

import { toast } from 'sonner';

type UseFormStatesEffectOptions = {
  states: {
    error?: string;
    success?: string;
    customerUserErrors?: Array<{ message?: string }>;
    userErrors?: Array<{ message?: string }>;
  } & Record<string, unknown>;
  userFeedback?: {
    error?: string;
    success?: string;
  };
  showSuccess?: boolean;
  showErrors?: boolean;
};

/**
 * Hook to handle form state side effects (toasts, notifications)
 * Standardizes error and success handling across all forms
 */
export function useFormStatesEffect({
  states,
  userFeedback,
  showSuccess = true,
  showErrors = true,
}: UseFormStatesEffectOptions) {
  useEffect(() => {
    if (!showErrors) return;

    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error) => {
        toast.error(error.message || userFeedback?.error || 'An error occurred');
      });
      return;
    }

    if (states.userErrors?.length) {
      states.userErrors.forEach((error) => {
        toast.error(error.message || userFeedback?.error || 'An error occurred');
      });
      return;
    }

    if (states.error) {
      toast.error(states.error);
    }
  }, [states, userFeedback, showErrors]);

  useEffect(() => {
    if (!showSuccess) return;

    if (states.success) {
      toast.success(states.success || userFeedback?.success || 'Operation completed successfully');
    }
  }, [states.success, userFeedback, showSuccess]);
}
