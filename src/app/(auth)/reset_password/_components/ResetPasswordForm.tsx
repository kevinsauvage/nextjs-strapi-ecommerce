'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { resetPasswordAction } from '@/actions/authActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import config from '@/config/index';

const { userFeedback } = config;

const initialStates = {
  password: '',
};

const ResetButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Reset'}</button>;
};

const ResetForm = ({ resetUrl }: { resetUrl: string }) => {
  const [formData, setFormData] = useState(initialStates);
  const [states, action, isPending] = useActionState<
    {
      password?: string | string[];
      resetUrl?: string | string[];
      customerUserErrors?: { message?: string }[];
      error?: string;
    },
    undefined
  >(resetPasswordAction, initialStates);

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
    <form action={action} title="Reset Password" autoComplete="off">
      <input type="hidden" name="resetUrl" value={resetUrl} />
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
      {states.password && <div className="text-red-500 text-sm mt-2">{states.password}</div>}
      <ResetButton />
    </form>
  );
};

export default ResetForm;
