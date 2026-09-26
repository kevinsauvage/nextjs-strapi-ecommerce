'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import FormFieldError from '@/components/FormFieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CouponCodeForm = () => {
  const t = useTranslations('cart');
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
        setError(t('promoInvalid'));
        setIsLoading(false);
        return;
      }

      await updateDiscountCodes(discountCodesArray);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedApplyPromo'));
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
        <div className="flex-1 space-y-2">
          <Label htmlFor="couponCode" className="sr-only">
            {t('couponLabel')}
          </Label>
          <Input
            type="text"
            id="couponCode"
            name="couponCode"
            placeholder={t('couponPlaceholder')}
            className="w-full"
            disabled={isLoading}
            aria-invalid={!!error?.at(-1)}
            aria-describedby={error?.at(-1) ? 'couponCode-error' : undefined}
          />
          <FormFieldError error={error ?? undefined} fieldId="couponCode" />
        </div>
        <Button type="submit" loading={isLoading} className="shrink-0">
          {t('apply')}
        </Button>
      </div>
    </form>
  );
};

export default CouponCodeForm;
