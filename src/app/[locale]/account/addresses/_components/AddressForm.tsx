'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormToast } from '@/hooks/useFormToast';
import { emptyFormState, type FormState } from '@/types/formActions';

const SubmitButton = ({ buttonText }: { buttonText: string }) => {
  const status = useFormStatus();
  return (
    <Button type="submit" loading={status.pending} className="w-full md:w-auto">
      {buttonText}
    </Button>
  );
};

type AddressAction = (input: {
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  country: string;
  firstName: string;
  id?: string;
  lastName: string;
  phone?: string;
  province?: string;
  zip: string;
}) => Promise<FormState>;

const AddressFormUI = ({
  action,
  address,
  buttonText,
}: {
  action: AddressAction;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    company?: string;
    country?: string;
    firstName?: string;
    id?: string;
    lastName?: string;
    phone?: string;
    province?: string;
    zip?: string;
  };

  buttonText: string;
}) => {
  const t = useTranslations('account');

  // Wrapper function to extract FormData and call typed server action
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const address1 = formData.get('address1') as string;
    const address2 = formData.get('address2') as string;
    const city = formData.get('city') as string;
    const company = formData.get('company') as string;
    const country = formData.get('country') as string;
    const firstName = formData.get('firstName') as string;
    const id = formData.get('id') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const province = formData.get('province') as string;
    const zip = formData.get('zip') as string;

    return action({
      address1,
      address2: address2 || undefined,
      city,
      company: company || undefined,
      country,
      firstName,
      id: id || undefined,
      lastName,
      phone: phone || undefined,
      province: province || undefined,
      zip,
    });
  };

  const [state, actionState, isPending] = useActionState<FormState, FormData>(
    handleSubmit,
    emptyFormState,
  );

  useFormToast(state);

  return (
    <form action={actionState} className="space-y-8">
      {address?.id && <input type="hidden" name="id" value={address?.id} />}

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-heading-4">{t('formContactTitle')}</h3>
          <p className="text-body-sm text-secondary">{t('formContactHint')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder={t('firstName')}
              required={true}
              type="text"
              defaultValue={address?.firstName}
              disabled={isPending}
              aria-invalid={!!state.errors?.firstName?.length}
              aria-describedby={state.errors?.firstName?.length ? 'firstName-error' : undefined}
            />
            <FormFieldError error={state.errors?.firstName} fieldId="firstName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder={t('lastName')}
              required={true}
              type="text"
              defaultValue={address?.lastName}
              disabled={isPending}
              aria-invalid={!!state.errors?.lastName?.length}
              aria-describedby={state.errors?.lastName?.length ? 'lastName-error' : undefined}
            />
            <FormFieldError error={state.errors?.lastName} fieldId="lastName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">{t('company')}</Label>
            <Input
              id="company"
              name="company"
              placeholder={t('companyPlaceholder')}
              type="text"
              defaultValue={address?.company}
              disabled={isPending}
              aria-invalid={!!state.errors?.company?.length}
              aria-describedby={state.errors?.company?.length ? 'company-error' : undefined}
            />
            <FormFieldError error={state.errors?.company} fieldId="company" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              name="phone"
              placeholder={t('phone')}
              type="text"
              defaultValue={address?.phone}
              disabled={isPending}
              aria-invalid={!!state.errors?.phone?.length}
              aria-describedby={state.errors?.phone?.length ? 'phone-error' : undefined}
            />
            <FormFieldError error={state.errors?.phone} fieldId="phone" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-heading-4">{t('formShippingTitle')}</h3>
          <p className="text-body-sm text-secondary">{t('formShippingHint')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="w-full space-y-2">
            <Label htmlFor="address1">{t('address1')}</Label>
            <Input
              id="address1"
              name="address1"
              placeholder={t('address1Placeholder')}
              required={true}
              type="text"
              defaultValue={address?.address1}
              disabled={isPending}
              aria-invalid={!!state.errors?.address1?.length}
              aria-describedby={state.errors?.address1?.length ? 'address1-error' : undefined}
            />
            <FormFieldError error={state.errors?.address1} fieldId="address1" />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="address2">{t('address2')}</Label>
            <Input
              id="address2"
              name="address2"
              placeholder={t('address2Placeholder')}
              type="text"
              defaultValue={address?.address2}
              disabled={isPending}
              aria-invalid={!!state.errors?.address2?.length}
              aria-describedby={state.errors?.address2?.length ? 'address2-error' : undefined}
            />
            <FormFieldError error={state.errors?.address2} fieldId="address2" />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="city">{t('city')}</Label>
            <Input
              id="city"
              name="city"
              placeholder={t('city')}
              required={true}
              type="text"
              defaultValue={address?.city}
              disabled={isPending}
              aria-invalid={!!state.errors?.city?.length}
              aria-describedby={state.errors?.city?.length ? 'city-error' : undefined}
            />
            <FormFieldError error={state.errors?.city} fieldId="city" />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="province">{t('province')}</Label>
            <Input
              id="province"
              name="province"
              placeholder={t('provincePlaceholder')}
              required={true}
              type="text"
              defaultValue={address?.province}
              disabled={isPending}
              aria-invalid={!!state.errors?.province?.length}
              aria-describedby={state.errors?.province?.length ? 'province-error' : undefined}
            />
            <FormFieldError error={state.errors?.province} fieldId="province" />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="country">{t('country')}</Label>
            <Input
              id="country"
              name="country"
              placeholder={t('country')}
              required={true}
              type="text"
              defaultValue={address?.country}
              disabled={isPending}
              aria-invalid={!!state.errors?.country?.length}
              aria-describedby={state.errors?.country?.length ? 'country-error' : undefined}
            />
            <FormFieldError error={state.errors?.country} fieldId="country" />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="zip">{t('zip')}</Label>
            <Input
              id="zip"
              name="zip"
              placeholder={t('zipPlaceholder')}
              required={true}
              type="text"
              defaultValue={address?.zip}
              disabled={isPending}
              aria-invalid={!!state.errors?.zip?.length}
              aria-describedby={state.errors?.zip?.length ? 'zip-error' : undefined}
            />
            <FormFieldError error={state.errors?.zip} fieldId="zip" />
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <SubmitButton buttonText={buttonText} />
      </div>
    </form>
  );
};

export default AddressFormUI;
