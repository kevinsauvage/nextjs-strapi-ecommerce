import type { FormActionResult } from '@/types/formActions';

import type { ZodError } from 'zod';

/**
 * Converts Zod validation errors to standardized form action result format
 */
export function zodErrorsToFormActionResult<T extends Record<string, string | string[]>>(
  zodError: ZodError,
): FormActionResult<T> {
  return {
    fieldErrors: zodError.formErrors.fieldErrors as T,
  };
}

/**
 * Creates a standardized error result
 */
export function createErrorResult(error: string): FormActionResult {
  return { error };
}

/**
 * Creates a standardized success result
 */
export function createSuccessResult(success: string): FormActionResult {
  return { success };
}
