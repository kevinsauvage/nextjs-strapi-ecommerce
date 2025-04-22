'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { contactAction } from '@/actions/contactActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import TextArea from '@/components/_forms/TextArea/TextArea';
import config from '@/config';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

const SubmitButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Contact Us'}</button>;
};

const ContactForm = () => {
  const { showToast } = useToastContext();

  const [states, action] = useActionState<
    {
      email?: string | string[];
      message?: string | string[];
      name?: string | string[];
      customerUserErrors?: { message?: string }[];
      error?: string;
    },
    undefined
  >(contactAction, {
    email: '',
    message: '',
    name: '',
  });

  useEffect(() => {
    if (states.error) {
      showToast.error(states.error || config.userFeedback.login.error);
    }
  }, [showToast, states]);

  return (
    <Form action={action} title="Contact Us">
      <Input
        id="email"
        label="Email address"
        name="email"
        placeholder="Email"
        required={true}
        error={states.email}
      />
      <Input
        placeholder="Name"
        name="name"
        id="name"
        label="Name"
        required={true}
        error={states.name}
      />
      <TextArea
        placeholder="Message"
        name="message"
        id="message"
        label="Message"
        required={true}
        error={states.message}
      />
      <SubmitButton />
    </Form>
  );
};

export default ContactForm;
