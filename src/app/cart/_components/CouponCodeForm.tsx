'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { api } from '@/utils/apiClient';

const CouponCodeForm = ({ discountCodes }: { discountCodes: CartFieldsFragment }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const discountCodesArray = formData.getAll('couponCode') as string[];

    try {
      const response = await api.patch<{
        cart: CartFieldsFragment;
        message: string;
        warnings?: unknown[];
      }>('/api/cart/discount-codes', { discountCodes: discountCodesArray });

      toast.success(response.message || 'Discount code applied successfully');

      // Reset form
      e.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update discount codes');
    } finally {
      setIsLoading(false);
    }
  };

  const existingCodes = discountCodes?.discountCodes || [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
