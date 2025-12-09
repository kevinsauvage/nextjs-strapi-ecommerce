'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { contactAction } from '@/actions/contactActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import config from '@/config';

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit">{status.pending ? 'Loading...' : 'Contact Us'}</Button>;
};

const ContactForm = () => {
  // Wrapper function to extract FormData and call typed server action
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    return contactAction({ email, message, name });
  };

  const [states, action] = useActionState<
    {
      email?: string | string[];
      message?: string | string[];
      name?: string | string[];
      customerUserErrors?: { message?: string }[];
      error?: string;
    },
    FormData
  >(handleSubmit, {
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
    <form
      action={action}
      title="Contact Us"
      className="space-y-6 py-12 max-w-md mx-auto w-full px-4"
    >
      <Label className="mb-2 flex flex-col items-start" htmlFor="email">
        Email address
        <Input id="email" name="email" placeholder="Email" required={true} />
        {states.email && <span className="text-red-500 text-sm">{states.email}</span>}
      </Label>
      <Label className="mb-2 flex flex-col items-start" htmlFor="name">
        Name
        <Input placeholder="Name" name="name" id="name" required={true} />
        {states.name && <span className="text-red-500 text-sm">{states.name}</span>}
      </Label>
      <Label className="mb-2 flex flex-col items-start" htmlFor="message">
        Message
        <Textarea placeholder="Message" name="message" id="message" required={true} />
        {states.message && <span className="text-red-500 text-sm">{states.message}</span>}
      </Label>
      <SubmitButton />
    </form>
  );
};

export default ContactForm;
