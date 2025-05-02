'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { recoverPasswordAction } from '@/actions/authActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CustomerUserError } from '@/shopify/storefront';

const SubmitButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Send mail'}</button>;
};

const RecoverForm = () => {
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
      toast.error(states.error);
    }

    if (states.success) {
      toast.success(states.success);
    }

    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        toast.error(error.message || 'An error occurred while recovering the password.');
      });
    }
  }, [states]);

  return (
    <form action={action} title="Recover password">
      <Label htmlFor="email" className="mb-2">
        Email address
      </Label>
      <Input id="email" name="email" type="email" placeholder="Email" required={true} />

      {states.error && <div className="text-red-500 text-sm mt-2">{states.error}</div>}

      <SubmitButton />
    </form>
  );
};

export default RecoverForm;
