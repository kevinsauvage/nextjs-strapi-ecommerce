'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { CustomerUserError } from '@/shopify/storefront';

import { recoverPasswordAction } from '@/actions/authActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

const SubmitButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Send mail'}</button>;
};

const RecoverForm = () => {
  const { showToast } = useToastContext();

  const [states, action] = useActionState<
    {
      email?: string | string[];
      error?: string;
      customerUserErrors?: CustomerUserError[];
      success?: string;
    },
    undefined
  >(recoverPasswordAction, {
    email: '',
  });

  useEffect(() => {
    if (states.error) {
      showToast.error(states.error);
    }

    if (states.success) {
      showToast.success(states.success);
    }

    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        showToast.error(error.message || 'An error occurred while recovering the password.');
      });
    }
  }, [showToast, states]);

  return (
    <Form action={action} title="Recover password">
      <Input
        id="email"
        label="Email address"
        name="email"
        type="email"
        placeholder="Email"
        required={true}
        error={states.email}
      />

      <SubmitButton />
    </Form>
  );
};

export default RecoverForm;
