'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { registerAction } from '@/actions/authActions';
import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userFeedback } from '@/data/userFeedback';
import type { CustomerUserError } from '@/shopify/storefront';

import Form from '../../_components/Form';
import PasswordField from '../../_components/PasswordField';

import { toast } from 'sonner';

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" loading={status.pending}>
      Create account
    </Button>
  );
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value || '' }));
  };

  const handleSubmit = async (_previousState: unknown, formData_: FormData) => {
    const email = formData_.get('email') as string;
    const firstName = formData_.get('firstName') as string;
    const lastName = formData_.get('lastName') as string;
    const password = formData_.get('password') as string;
    const passwordConfirm = formData_.get('passwordConfirm') as string;

    return registerAction({ email, firstName, lastName, password, passwordConfirm });
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
      userErrors?: Array<{ message: string }>;
    },
    FormData
  >(handleSubmit, initialStates);

  useEffect(() => {
    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        toast.error(error.message || userFeedback.register.error);
      });
    }
    if (states.error) {
      toast.error(typeof states.error === 'string' ? states.error : userFeedback.register.error);
    }
  }, [states]);

  return (
    <Form action={action} autoComplete="off" className="space-y-5">
      {(states.error || states.customerUserErrors?.length || states.userErrors?.length) && (
        <div role="alert" aria-live="polite" className="text-destructive text-body-sm">
          {states.error ||
            states.customerUserErrors?.[0]?.message ||
            states.userErrors?.[0]?.message ||
            userFeedback.register.error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="off"
          placeholder="name@company.com"
          required={true}
          onChange={handleChange}
          value={formData.email}
          disabled={isPending}
          aria-invalid={!!states.email?.at(-1)}
          aria-describedby={states.email?.at(-1) ? 'email-error' : undefined}
        />
        <FormFieldError error={states.email} fieldId="email" />
      </div>
      <div className="space-y-2">
        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          required={true}
          onChange={handleChange}
          value={formData.password}
          disabled={isPending}
          error={states.password}
        />
      </div>

      <div className="space-y-2">
        <PasswordField
          id="passwordConfirm"
          name="passwordConfirm"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required={true}
          onChange={handleChange}
          value={formData.passwordConfirm}
          disabled={isPending}
          error={states.passwordConfirm}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>
        <Input
          placeholder="John"
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="off"
          onChange={handleChange}
          value={formData.firstName}
          disabled={isPending}
          aria-invalid={!!states.firstName?.at(-1)}
          aria-describedby={states.firstName?.at(-1) ? 'firstName-error' : undefined}
        />
        <FormFieldError error={states.firstName} fieldId="firstName" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>
        <Input
          placeholder="Doe"
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="off"
          onChange={handleChange}
          value={formData.lastName}
          disabled={isPending}
          aria-invalid={!!states.lastName?.at(-1)}
          aria-describedby={states.lastName?.at(-1) ? 'lastName-error' : undefined}
        />
        <FormFieldError error={states.lastName} fieldId="lastName" />
      </div>
      <SubmitButton />
    </Form>
  );
};

export default RegisterForm;
