'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { registerAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userFeedback } from '@/data/userFeedback';
import type { CustomerUserError } from '@/shopify/storefront';

import Form from '../../_components/Form';

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending}>
      {status.pending ? 'Loading...' : 'Register'}
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
    <Form action={action} title="Register" autoComplete="off">
      <h3 className="mb-8 text-2xl font-bold">Register</h3>
      <div>
        <Label htmlFor="email" className="mb-1">
          Email address:
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="off"
          placeholder="Email"
          required={true}
          onChange={handleChange}
          value={formData.email}
          disabled={isPending}
        />
        {states.email?.at(-1) && <p className="text-red-500 text-sm mt-1">{states.email.at(-1)}</p>}
      </div>
      <div>
        <Label htmlFor="password" className="mb-1">
          Password:
        </Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          autoComplete="off"
          required={true}
          onChange={handleChange}
          value={formData.password}
          disabled={isPending}
        />
        {states.password?.at(-1) && (
          <p className="text-red-500 text-sm mt-1">{states.password.at(-1)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="passwordConfirm" className="mb-1">
          Password Confirmation:
        </Label>
        <Input
          placeholder="Password Confirmation"
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          autoComplete="off"
          required={true}
          onChange={handleChange}
          value={formData.passwordConfirm}
          disabled={isPending}
        />
        {states.passwordConfirm?.at(-1) && (
          <p className="text-red-500 text-sm mt-1">{states.passwordConfirm.at(-1)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="firstName" className="mb-1">
          First name:
        </Label>
        <Input
          placeholder="First name"
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="off"
          onChange={handleChange}
          value={formData.firstName}
          disabled={isPending}
        />
        {states.firstName?.at(-1) && (
          <p className="text-red-500 text-sm mt-1">{states.firstName.at(-1)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="lastName" className="mb-1">
          Last name:
        </Label>
        <Input
          placeholder="Last name"
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="off"
          onChange={handleChange}
          value={formData.lastName}
        />
        {states.lastName?.at(-1) && (
          <p className="text-red-500 text-sm mt-1">{states.lastName.at(-1)}</p>
        )}
      </div>
      <SubmitButton />
    </Form>
  );
};

export default RegisterForm;
