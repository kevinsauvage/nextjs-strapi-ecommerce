'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

import { registerAction } from '@/actions/authActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Flexbox from '@/components/Flexbox/Flexbox';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import type { CustomerUserError } from '@/shopify/storefront';

const { userFeedback, routes } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Register'}</button>;
};

const RegisterForm = () => {
  const initialStates = {
    email: '',
    firstName: '',
    lastName: '',
    name: '',
    password: '',
    passwordConfirm: '',
  };
  const [formData, setFormData] = useState(initialStates);
  const { showToast } = useToastContext();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value || '' }));
  };

  const [states, action, isPending] = useActionState<
    {
      email?: string | string[];
      firstName?: string | string[];
      lastName?: string | string[];
      name?: string | string[];
      password?: string | string[];
      passwordConfirm?: string | string[];
      error?: string;
      username?: string | string[];
      company?: string | string[];
      customerUserErrors?: CustomerUserError[];
    },
    undefined
  >(registerAction, initialStates);

  useEffect(() => {
    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        showToast.error(error.message || userFeedback.register.error);
      });
    }
    if (states.error) {
      showToast.error(
        typeof states.error === 'string' ? states.error : userFeedback.register.error,
      );
    }
  }, [showToast, states]);

  return (
    <Form action={action} title="Register" autoComplete="off">
      <Input
        id="email"
        label="Email address"
        type="email"
        name="email"
        autoComplete="off"
        placeholder="Email"
        required={true}
        error={states.email}
        onChange={handleChange}
        value={formData.email}
        disabled={isPending}
      />

      <Input
        type="password"
        name="password"
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="off"
        required={true}
        error={states.password}
        onChange={handleChange}
        value={formData.password}
        disabled={isPending}
      />

      <Input
        placeholder="Password Confirmation"
        type="password"
        name="passwordConfirm"
        id="passwordConfirm"
        label="Password Confirmation"
        autoComplete="off"
        required={true}
        error={states.passwordConfirm?.at(-1)}
        onChange={handleChange}
        value={formData.passwordConfirm}
        disabled={isPending}
      />

      <Input
        placeholder="First name"
        type="text"
        name="firstName"
        id="firstName"
        label="First name"
        autoComplete="off"
        error={states.firstName}
        onChange={handleChange}
        value={formData.name}
        disabled={isPending}
      />

      <Input
        placeholder="Last name"
        type="text"
        name="lastName"
        id="lastName"
        label="Last name"
        autoComplete="off"
        error={states.lastName}
        onChange={handleChange}
        value={formData.name}
        disabled={isPending}
      />

      <SubmitButton />
      <Flexbox gap="6px">
        <Link href={routes.login}>LOGIN</Link> or
        <Link href={routes.emailResetPassword}>RESET PASSWORD</Link>
      </Flexbox>
    </Form>
  );
};

export default RegisterForm;
