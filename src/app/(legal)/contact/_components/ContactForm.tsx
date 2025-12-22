'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { contactAction } from '@/actions/contactActions';
import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { userFeedback } from '@/data/userFeedback';

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" loading={status.pending}>
      Send message
    </Button>
  );
};

const ContactForm = () => {
  // Wrapper function to extract FormData and call typed server action
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    return contactAction({ email, message, name });
  };

  const [states, action, isPending] = useActionState<
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
      toast.error(states.error || userFeedback.login.error);
    }
  }, [states]);

  const emailError = Array.isArray(states.email) ? states.email.at(-1) : states.email;
  const nameError = Array.isArray(states.name) ? states.name.at(-1) : states.name;
  const messageError = Array.isArray(states.message) ? states.message.at(-1) : states.message;

  return (
    <form
      action={action}
      title="Contact Us"
      className="space-y-6 py-8 md:py-12 max-w-md mx-auto w-full px-4 md:px-6"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          placeholder="name@company.com"
          required={true}
          disabled={isPending}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        <FormFieldError error={states.email} fieldId="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          placeholder="Your name"
          name="name"
          id="name"
          required={true}
          disabled={isPending}
          aria-invalid={!!nameError}
          aria-describedby={nameError ? 'name-error' : undefined}
        />
        <FormFieldError error={states.name} fieldId="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          placeholder="Your message"
          name="message"
          id="message"
          required={true}
          disabled={isPending}
          aria-invalid={!!messageError}
          aria-describedby={messageError ? 'message-error' : undefined}
        />
        <FormFieldError error={states.message} fieldId="message" />
      </div>
      {states.error && (
        <div role="alert" aria-live="polite" className="text-destructive text-body-sm">
          {states.error || userFeedback.login.error}
        </div>
      )}
      <SubmitButton />
    </form>
  );
};

export default ContactForm;
