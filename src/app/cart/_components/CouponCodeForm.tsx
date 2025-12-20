'use client';
import { useRef, useState } from 'react';

import SpinnerLoader from '@/components/SpinnerLoader';
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

    try {
      const formData = new FormData(e.currentTarget);
      const discountCodesArray = formData
        .getAll('couponCode')
        .map((value) => String(value).trim())
        .filter((code) => code.length > 0);

      if (discountCodesArray.length === 0) {
        return;
      }

      await updateDiscountCodes(discountCodesArray);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const existingCodes = cart?.discountCodes || [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" ref={formRef}>
      {existingCodes.map((code) => (
        <input key={code.code} type="hidden" name="couponCode" value={code.code} />
      ))}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="couponCode" className="sr-only">
            Coupon Code
          </Label>
          <Input
            type="text"
            id="couponCode"
            name="couponCode"
            placeholder="Enter promo code"
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="shrink-0">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerLoader size="sm" />
              Applying...
            </span>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CouponCodeForm;
