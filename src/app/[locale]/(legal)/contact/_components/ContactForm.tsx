'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import { contactAction } from '@/actions/contactActions';
import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormToast } from '@/hooks/useFormToast';
import { emptyFormState, type FormState } from '@/types/formActions';

const SubmitButton = () => {
  const t = useTranslations('legal');
  const status = useFormStatus();
  return (
    <Button type="submit" loading={status.pending}>
      {t('contactSubmit')}
    </Button>
  );
};

const ContactForm = () => {
  const t = useTranslations('legal');
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const website = formData.get('website') as string;
    return contactAction({ email, message, name, website: website || undefined });
  };

  const [state, action, isPending] = useActionState<FormState, FormData>(
    handleSubmit,
    emptyFormState,
  );

  useFormToast(state);

  return (
    <form action={action} className="space-y-6 py-8 md:py-12 max-w-md mx-auto w-full px-4 md:px-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t('contactEmailLabel')}</Label>
        <Input
          id="email"
          name="email"
          placeholder="name@company.com"
          required={true}
          disabled={isPending}
          aria-invalid={!!state.errors?.email?.at(-1)}
          aria-describedby={state.errors?.email?.at(-1) ? 'email-error' : undefined}
        />
        <FormFieldError error={state.errors?.email} fieldId="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">{t('contactNameLabel')}</Label>
        <Input
          placeholder={t('contactNamePlaceholder')}
          name="name"
          id="name"
          required={true}
          disabled={isPending}
          aria-invalid={!!state.errors?.name?.at(-1)}
          aria-describedby={state.errors?.name?.at(-1) ? 'name-error' : undefined}
        />
        <FormFieldError error={state.errors?.name} fieldId="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t('contactMessageLabel')}</Label>
        <Textarea
          placeholder={t('contactMessagePlaceholder')}
          name="message"
          id="message"
          required={true}
          disabled={isPending}
          aria-invalid={!!state.errors?.message?.at(-1)}
          aria-describedby={state.errors?.message?.at(-1) ? 'message-error' : undefined}
        />
        <FormFieldError error={state.errors?.message} fieldId="message" />
      </div>
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          disabled={isPending}
        />
      </div>
      <SubmitButton />
    </form>
  );
};

export default ContactForm;
