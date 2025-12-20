'use client';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CouponCodeForm = () => {
  const { cart, updateDiscountCodes } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const discountCodesArray = formData
      .getAll('couponCode')
      .map((value) => String(value).trim())
      .filter((code) => code.length > 0);

    if (discountCodesArray.length === 0) {
      setIsLoading(false);
      return;
    }

    await updateDiscountCodes(discountCodesArray);
    formRef.current?.reset();
    setIsLoading(false);
  };

  const existingCodes = cart?.discountCodes || [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4" ref={formRef}>
      {existingCodes.map((code) => (
        <input key={code.code} type="hidden" name="couponCode" value={code.code} />
      ))}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="couponCode" className="sr-only">
          Coupon Code
        </Label>
        <Input type="text" id="couponCode" name="couponCode" className="border border-gray-300" />
      </div>
      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Apply Coupon'}
      </Button>
    </form>
  );
};

export default CouponCodeForm;
