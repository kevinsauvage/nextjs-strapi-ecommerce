'use client';
import { useRef, useState } from 'react';

import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CouponCodeForm = () => {
  const { cart, updateDiscountCodes } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const discountCodesArray = formData
        .getAll('couponCode')
        .map((value) => String(value).trim())
        .filter((code) => code.length > 0);

      if (discountCodesArray.length === 0) {
        setError('Please enter a promo code');
        setIsLoading(false);
        return;
      }

      await updateDiscountCodes(discountCodesArray);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply promo code');
    } finally {
      setIsLoading(false);
    }
  };

  const existingCodes = cart?.discountCodes || [];
  const hasError = !!error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" ref={formRef}>
      {error && (
        <div role="alert" aria-live="polite" className="text-destructive text-body-sm">
          {error}
        </div>
      )}
      {existingCodes.map((code) => (
        <input key={code.code} type="hidden" name="couponCode" value={code.code} />
      ))}
      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
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
            aria-invalid={hasError}
            aria-describedby={hasError ? 'couponCode-error' : undefined}
          />
          <FormFieldError error={error} fieldId="couponCode" />
        </div>
        <Button type="submit" loading={isLoading} className="shrink-0">
          Apply
        </Button>
      </div>
    </form>
  );
};

export default CouponCodeForm;
