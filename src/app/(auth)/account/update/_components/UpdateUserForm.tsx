'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { updateUserAction } from '@/actions/usersActions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import config from '@/config';
import useUserContext from '@/contexts/UserContext/useUserContext';
import type { CustomerUserError } from '@/shopify/storefront';

const { userFeedback } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending}>
      {status.pending ? 'Loading...' : 'Update'}
    </Button>
  );
};

const UpdateUserForm = () => {
  const { user } = useUserContext();
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
    undefined
  >(updateUserAction, user);
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
  }, [states, user]);

  useEffect(() => {
    setAcceptsMarketing(user.acceptsMarketing);
  }, [user.acceptsMarketing]);

  return (
    <form action={action} className="space-y-8">
      <div className="">
        <h3 className="text-2xl font-bold leading-tight tracking-tight">
          Fill in the form below to update your profile. <br />
        </h3>
        <span className="text-sm text-muted-foreground">
          You can update your profile information at any time.
        </span>
      </div>

      <input type="hidden" name="email" value={user.email} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Label className="flex flex-col items-start">
          <p>First Name</p>
          <Input id="firstName" type="text" name="firstName" defaultValue={user.firstName} />
        </Label>
        <Label className="flex flex-col items-start">
          <p>Last Name</p>
          <Input id="lastName" type="text" name="lastName" defaultValue={user.lastName} />
        </Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Label className="flex flex-col items-start">
          <p>Email</p>
          <Input id="email" type="email" disabled defaultValue={user.email} />
        </Label>
        <Label className="flex flex-col items-start">
          <p>Phone</p>
          <Input id="phone" type="text" name="phone" defaultValue={user.phone} />
        </Label>
      </div>

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
