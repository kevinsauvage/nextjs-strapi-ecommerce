'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { loginAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import config from '@/config/index';
import type { CustomerUserError } from '@/shopify/storefront';

const { userFeedback } = config;

const LoginButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto">
      {status.pending ? 'Loading...' : 'Login'}
    </Button>
  );
};

const LoginForm = () => {
  const searchParameters = useSearchParams();
  const [states, action] = useActionState<
    {
      email?: string | string[];
      password?: string | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
    },
    undefined
  >(loginAction, {
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
    <form action={action} className="space-y-6 py-12 max-w-md mx-auto w-full px-4">
      <input type="hidden" name="redirectUrl" value={searchParameters.get('redirect') || ''} />
      <h3 className="mb-8 text-2xl font-bold">Login</h3>
      <div>
        <Label htmlFor="email" className="mb-1">
          Email address:
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          required={true}
          autoComplete="username"
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-1">
          Password:
        </Label>
        <Input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="Password"
          required={true}
        />
      </div>
      <LoginButton />
    </form>
  );
};

export default LoginForm;
