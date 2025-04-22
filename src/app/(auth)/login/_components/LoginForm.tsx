'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';

import { loginAction } from '@/actions/authActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Wrapper from '@/components/Wrapper/Wrapper';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

const { userFeedback, routes } = config;

import { useFormStatus } from 'react-dom';

import type { CustomerUserError } from '@/shopify/storefront';

const LoginButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Login'}</button>;
};

const LoginForm = () => {
  const { showToast } = useToastContext();

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
        showToast.error(error.message || userFeedback.login.error);
      });
    }

    if (states.error) {
      showToast.error(states.error);
    }
  }, [showToast, states]);

  return (
    <Form action={action} title="Login">
      <Input
        id="email"
        label="Email address"
        type="email"
        name="email"
        placeholder="Email"
        required={true}
        autoComplete="username"
      />
      <Input
        type="password"
        name="password"
        id="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Password"
        required={true}
      />

      <LoginButton />
      <Wrapper gap="6px">
        <Link href={routes.register}>REGISTER</Link> or
        <Link href={routes.emailResetPassword}>RESET PASSWORD</Link>
      </Wrapper>
    </Form>
  );
};

export default LoginForm;
