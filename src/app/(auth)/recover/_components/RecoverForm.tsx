'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { recoverPasswordAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CustomerUserError } from '@/shopify/storefront';

import Form from '../../_components/Form';

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit">{status.pending ? 'Loading...' : 'Send mail'}</Button>;
};

const RecoverForm = () => {
  // Wrapper function to extract FormData and call typed server action
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const email = formData.get('email') as string;
    return recoverPasswordAction({ email });
  };

  const [states, action] = useActionState<
    {
      email?: string | string[];
      error?: string;
      customerUserErrors?: CustomerUserError[];
      success?: string;
    },
    FormData
  >(handleSubmit, {
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
    <Form action={action} title="Recover password">
      <Label htmlFor="email" className="mb-2">
        Email address
      </Label>
      <Input id="email" name="email" type="email" placeholder="Email" required={true} />
      {states.error && <div className="text-destructive text-body-sm mt-2">{states.error}</div>}
      <SubmitButton />
    </Form>
  );
};

export default RecoverForm;
