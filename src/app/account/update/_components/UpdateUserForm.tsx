'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { updateUserAction } from '@/actions/usersActions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { userFeedback } from '@/data/userFeedback';
import type { CustomerUserError } from '@/shopify/storefront';

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" loading={status.pending}>
      Update
    </Button>
  );
};

const UpdateUserForm = () => {
  const { user } = useUserContext();

  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    if (!user) return { error: 'User not found' };

    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const acceptsMarketing = formData.get('acceptsMarketing') as string;

    return updateUserAction({ acceptsMarketing, email, firstName, lastName, phone });
  };

  const [states, action] = useActionState<
    {
      firstName?: string | string[];
      lastName?: string | string[];
      phone?: string | string[];
      acceptsMarketing?: boolean | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
      success?: string;
    },
    FormData
  >(handleSubmit, {});
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  useEffect(() => {
    if (states?.error) {
      toast.error(states.error || userFeedback.login.error);
    }

    if (states?.success) {
      toast.success(states.success || userFeedback.login.success);
    }

    if (states?.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        toast.error(error.message || userFeedback.login.error);
      });
    }
  }, [states]);

  useEffect(() => {
    if (user) {
      setAcceptsMarketing(user.acceptsMarketing ?? false);
    }
  }, [user]);

  return (
    <form action={action} className="space-y-8">
      {user && (
        <>
          <input type="hidden" name="email" value={user.email ?? ''} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Label className="flex flex-col items-start">
              <p>First Name</p>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                defaultValue={user.firstName ?? ''}
              />
            </Label>
            <Label className="flex flex-col items-start">
              <p>Last Name</p>
              <Input id="lastName" type="text" name="lastName" defaultValue={user.lastName ?? ''} />
            </Label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Label className="flex flex-col items-start">
              <p>Email</p>
              <Input id="email" type="email" disabled defaultValue={user.email ?? ''} />
            </Label>
            <Label className="flex flex-col items-start">
              <p>Phone</p>
              <Input id="phone" type="text" name="phone" defaultValue={user.phone ?? ''} />
            </Label>
          </div>
        </>
      )}

      <Label htmlFor="acceptsMarketing">
        <Checkbox
          name="acceptsMarketing"
          defaultChecked={acceptsMarketing}
          value={acceptsMarketing ? 'true' : 'false'}
          checked={acceptsMarketing}
          onCheckedChange={(checked) => {
            setAcceptsMarketing(checked as boolean);
          }}
          id="acceptsMarketing"
        />
        <p>Check this case to receive our last update</p>
      </Label>
      <SubmitButton />
    </form>
  );
};

export default UpdateUserForm;
