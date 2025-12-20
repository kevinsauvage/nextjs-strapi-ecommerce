'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { resetPasswordAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userFeedback } from '@/data/userFeedback';

import Form from '../../_components/Form';

const initialStates = {
  password: '',
};

const ResetButton = () => {
  const status = useFormStatus();
  return <Button type="submit">{status.pending ? 'Loading...' : 'Reset'}</Button>;
};

const ResetForm = ({ resetUrl }: { resetUrl: string }) => {
  const [formData, setFormData] = useState(initialStates);

  const handleSubmit = async (_previousState: unknown, formData_: FormData) => {
    const password = formData_.get('password') as string;
    return resetPasswordAction({ password, resetUrl });
  };

  const [states, action, isPending] = useActionState<
    {
      password?: string | string[];
      resetUrl?: string | string[];
      customerUserErrors?: { message?: string }[];
      error?: string;
    },
    FormData
  >(handleSubmit, initialStates);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value || '' }));
  };

  useEffect(() => {
    if (states.error) {
      toast.error(
        typeof states.error === 'string' ? states.error : userFeedback.resetPassword.error,
      );
    }
  }, [states]);

  return (
    <Form action={action} title="Reset Password" autoComplete="off">
      <Label htmlFor="password" className="mb-2">
        New password
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="New password"
        required={true}
        onChange={handleChange}
        value={formData.password}
        disabled={isPending}
      />
      {states.password && <div className="text-destructive text-body-sm mt-2">{states.password}</div>}
      <ResetButton />
    </Form>
  );
};

export default ResetForm;
