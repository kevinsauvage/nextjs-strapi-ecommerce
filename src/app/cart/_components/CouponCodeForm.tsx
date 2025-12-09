'use client';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { cartDiscountCodesUpdateAction } from '@/actions/cartActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CartFieldsFragment } from '@/shopify/storefront';

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto">
      {status.pending ? 'Loading...' : 'Apply Coupon'}
    </Button>
  );
};

const CouponCodeForm = ({ discountCodes }: { discountCodes: CartFieldsFragment }) => {
  const handleSubmit = async (_previousState: unknown, formData: FormData) => {
    const discountCodesArray = formData.getAll('couponCode') as string[];
    return cartDiscountCodesUpdateAction(discountCodesArray);
  };

  const [states, action] = useActionState<
    {
      couponCode?: string | string[];
      success?: boolean;
      message?: string;
      cart?: CartFieldsFragment;
    },
    FormData
  >(handleSubmit, {});

  useEffect(() => {
    if (states.success) {
      toast.success(states.message);
    } else if (states.message) {
      toast.error(states.message);
    }
  }, [states.message, states.success]);

  const existingCodes = discountCodes?.discountCodes || [];

  return (
    <form action={action} className="flex flex-col space-y-4">
      {existingCodes.map((code) => (
        <input key={code.code} type="hidden" name="couponCode" value={code.code} />
      ))}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="couponCode" className="sr-only">
          Coupon Code
        </Label>
        <Input type="text" id="couponCode" name="couponCode" className="border border-gray-300" />
      </div>
      <SubmitButton />
    </form>
  );
};

export default CouponCodeForm;
