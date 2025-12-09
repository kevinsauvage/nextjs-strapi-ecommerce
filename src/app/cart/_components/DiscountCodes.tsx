'use client';

import { X } from 'lucide-react';
import { toast } from 'sonner';

import { cartDiscountCodesUpdateAction } from '@/actions/cartActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CartDiscountCode } from '@/shopify/storefront';

const DiscountCodes = ({ discountCodes }: { discountCodes: CartDiscountCode[] }) => {
  const handleRemoveCode = async (code: string) => {
    const newCoupons = discountCodes
      .filter((discountCode) => discountCode.code !== code)
      .map((discountCode) => discountCode.code);

    const response = await cartDiscountCodesUpdateAction(newCoupons);

    if (response?.success) {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  };

  if (discountCodes?.length === 0) {
    return null;
  }

  const applicableCodes = discountCodes.filter((code) => code.applicable);
  const notApplicableCodes = discountCodes.filter((code) => !code.applicable);

  return (
    <div className="flex flex-col gap-1 mt-2 space-y-4">
      {applicableCodes.length > 0 && (
        <div>
          <span className="block mb-2"> Applied: </span>
          <div className="flex flex-wrap gap-2">
            {applicableCodes.map((code) => {
              return (
                <div key={code.code}>
                  <Badge variant="secondary" className="py-0 pr-0">
                    {code.code}
                    <Button
                      onClick={() => {
                        handleRemoveCode(code.code).catch((error) => {
                          console.error('Error removing discount code:', error);
                        });
                      }}
                      className="cursor-pointer"
                      size="icon"
                      variant="ghost"
                    >
                      <X size={14} />
                    </Button>
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {notApplicableCodes.length > 0 && (
        <div>
          <span className="block mb-2"> Not Applicable: </span>
          <div className="flex flex-wrap gap-2">
            {notApplicableCodes.map((code) => {
              return (
                <div key={code.code}>
                  <Badge variant="destructive" className="py-0 pr-0">
                    {code.code}
                    <Button
                      onClick={() => {
                        handleRemoveCode(code.code).catch((error) => {
                          console.error('Error removing discount code:', error);
                        });
                      }}
                      className="cursor-pointer"
                      size="icon"
                      variant="ghost"
                    >
                      <X size={14} />
                    </Button>
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodes;
