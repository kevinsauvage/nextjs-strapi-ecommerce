'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { loginAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userFeedback } from '@/data/userFeedback';
import type { CustomerUserError } from '@/shopify/storefront';

import Form from '../../_components/Form';
import PasswordField from '../../_components/PasswordField';

const LoginButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto" loading={status.pending}>
      Sign in
    </Button>
  );
};

const LoginForm = () => {
  const searchParameters = useSearchParams();

  // Wrapper function to extract FormData and call typed server action
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectUrl = searchParameters.get('redirect') || undefined;

    return loginAction({ email, password, redirectUrl });
  };

  const [states, action, isPending] = useActionState<
    {
      email?: string | string[];
      password?: string | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
    },
    FormData
  >(handleSubmit, {
    customerUserErrors: [],
    email: [],
    error: '',
    password: [],
  });

  useEffect(() => {
    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        toast.error(error.message || userFeedback.login.error);
      });
      return;
    }

    if (states.error) {
      toast.error(states.error);
    }
  }, [states]);

  return (
    <Form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="name@company.com"
          required={true}
          autoComplete="username"
          disabled={isPending}
        />
      </div>
      <PasswordField
        id="password"
        name="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
        required={true}
        disabled={isPending}
      />
      <LoginButton />
    </Form>
  );
};

export default LoginForm;
