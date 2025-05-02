'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { contactAction } from '@/actions/contactActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import config from '@/config';

const SubmitButton = () => {
  const status = useFormStatus();
  return <button type="submit">{status.pending ? 'Loading...' : 'Contact Us'}</button>;
};

const ContactForm = () => {
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
      toast.error(states.error || config.userFeedback.login.error);
    }
  }, [states]);

  return (
    <form action={action} title="Contact Us">
      <Label className="mb-2 flex flex-col" htmlFor="email">
        Email address
        <Input id="email" name="email" placeholder="Email" required={true} />
        {states.email && <span className="text-red-500 text-sm">{states.email}</span>}
      </Label>
      <Label className="mb-2 flex flex-col" htmlFor="name">
        Name
        <Input placeholder="Name" name="name" id="name" required={true} />
        {states.name && <span className="text-red-500 text-sm">{states.name}</span>}
      </Label>
      <Label className="mb-2 flex flex-col" htmlFor="message">
        Message
        <Textarea placeholder="Message" name="message" id="message" required={true} />
        {states.message && <span className="text-red-500 text-sm">{states.message}</span>}
      </Label>
      <SubmitButton />
    </form>
  );
};

export default ContactForm;
