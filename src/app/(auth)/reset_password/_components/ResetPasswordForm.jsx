'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { resetPasswordAction } from '@/actions/authActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import config from '@/config/index';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

const { userFeedback } = config;

const initialStates = {
  password: '',
};

const ResetButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Reset'}</button>;
};

const ResetForm = ({ resetUrl }) => {
  const [formData, setFormData] = useState(initialStates);
  const [states, action, isPending] = useActionState(resetPasswordAction, initialStates);
  const { showToast } = useToastContext();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value || '' }));
  };

  useEffect(() => {
    if (states.error) {
      showToast.error(
        typeof states.error === 'string' ? states.error : userFeedback.resetPassword.error
      );
    }
  }, [showToast, states]);

  return (
    <Form action={action} title="Reset Password" autoComplete="off">
      <input type="hidden" name="resetUrl" value={resetUrl} />
      <Input
        id="password"
        label="New password"
        name="password"
        type="password"
        placeholder="New password"
        input="true"
        required="true"
        onChange={handleChange}
        value={formData.password}
        disabled={isPending}
        error={states.password}
      />

      <ResetButton />
    </Form>
  );
};

export default ResetForm;
