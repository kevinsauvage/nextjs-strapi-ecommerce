'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CustomerUserError } from '@/shopify/storefront';

const SubmitButton = ({ buttonText }: { buttonText: string }) => {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending} className="w-full md:w-auto">
      {status.pending ? 'Loading...' : buttonText}
    </Button>
  );
};

type actionType = (
  previousState: unknown,
  data: FormData,
) => Promise<{
  address1?: string | string[];
  address2?: string | string[];
  city?: string | string[];
  company?: string | string[];
  country?: string | string[];
  customerUserErrors?: CustomerUserError[];
  error?: string;
  firstName?: string | string[];
  id?: string | string[];
  lastName?: string | string[];
  phone?: string | string[];
  province?: string | string[];
  zip?: string | string[];
}>;

const AddressFormUI = ({
  action,
  address,
  buttonText = 'Create',
}: {
  action: actionType;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    company?: string;
    country?: string;
    customerUserErrors?: CustomerUserError[];
    error?: string;
    firstName?: string;
    id?: string;
    lastName?: string;
    phone?: string;
    province?: string;
    zip?: string;
  };

  buttonText: string;
}) => {
  const [states, actionState] = useActionState<
    {
      address1?: string | string[];
      address2?: string | string[];
      city?: string | string[];
      company?: string | string[];
      country?: string | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
      firstName?: string | string[];
      id?: string | string[];
      lastName?: string | string[];
      phone?: string | string[];
      province?: string | string[];
      zip?: string | string[];
    },
    undefined
  >(action, {});

  useEffect(() => {
    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error) => {
        if (error?.message) {
          toast.error(error.message);
        }
      });
    }

    if (states.error) {
      toast.error(states.error);
    }
  }, [states]);

  return (
    <form action={actionState} className="space-y-6">
      {address?.id && <input type="hidden" name="id" value={address?.id} />}
      <div className="space-y-6">
        <div className="space-y-4">
          <h6 className="text-xl font-heading mb-4">Contact Information</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required={true}
                type="text"
                defaultValue={address?.firstName}
              />
              {states?.firstName?.length && (
                <p className="text-red-500 text-sm">{states?.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required={true}
                type="text"
                defaultValue={address?.lastName}
              />
              {states?.lastName?.length && (
                <p className="text-red-500 text-sm">{states?.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                placeholder="Company"
                type="text"
                defaultValue={address?.company}
              />
              {states?.company?.length && <p className="text-red-500 text-sm">{states?.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone"
                type="text"
                defaultValue={address?.phone}
              />
              {states?.phone?.length && <p className="text-red-500 text-sm">{states?.phone}</p>}
            </div>
          </div>
        </div>

        <div>
          <h6 className="text-xl font-heading mb-4">Address</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="address1">Address 1</Label>
              <Input
                id="address1"
                name="address1"
                placeholder="Address 1"
                required={true}
                type="text"
                defaultValue={address?.address1}
              />
              {states?.address1?.length && (
                <p className="text-red-500 text-sm">{states?.address1}</p>
              )}
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="address2">Address 2</Label>
              <Input
                id="address2"
                name="address2"
                placeholder="Address 2"
                type="text"
                defaultValue={address?.address2}
              />
              {states?.address2?.length && (
                <p className="text-red-500 text-sm">{states?.address2}</p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                required={true}
                type="text"
                defaultValue={address?.city}
              />
              {states?.city?.length && <p className="text-red-500 text-sm">{states?.city}</p>}
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                name="province"
                placeholder="Province"
                required={true}
                type="text"
                defaultValue={address?.province}
              />
              {states?.province?.length && (
                <p className="text-red-500 text-sm">{states?.province}</p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="Country"
                required={true}
                type="text"
                defaultValue={address?.country}
              />
              {states?.country?.length && <p className="text-red-500 text-sm">{states?.country}</p>}
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="zip">Zip</Label>
              <Input
                id="zip"
                name="zip"
                placeholder="Zip"
                required={true}
                type="text"
                defaultValue={address?.zip}
              />
              {states?.zip?.length && <p className="text-red-500 text-sm">{states?.zip}</p>}
            </div>
          </div>
        </div>
      </div>
      <SubmitButton buttonText={buttonText} />
    </form>
  );
};

export default AddressFormUI;
