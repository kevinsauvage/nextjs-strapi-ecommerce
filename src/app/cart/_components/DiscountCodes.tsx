import { Badge } from '@/components/ui/badge';
import type { CartDiscountCode } from '@/shopify/storefront';

const DiscountCodes = ({ discountCodes }: { discountCodes: CartDiscountCode[] }) => {
  return discountCodes?.length > 0 ? (
    <div className="flex gap-1 mt-2">
      <div className="flex flex-wrap gap-2">
        {discountCodes.map(
          (code) =>
            code.applicable && (
              <div key={code.code}>
                Applied: <Badge variant="secondary">{code.code}</Badge>
              </div>
            ),
        )}
      </div>
    </div>
  ) : null;
};

export default DiscountCodes;
