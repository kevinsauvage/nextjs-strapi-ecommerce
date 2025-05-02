import type { MoneyV2, ProductFieldsFragment } from '@/shopify/storefront';

import { Badge } from './ui/badge';

const Price = ({
  compareAtPrice,
  price,
  priceRange,
}: {
  compareAtPrice: MoneyV2 | null;
  price: MoneyV2 | null;
  priceRange?: ProductFieldsFragment['priceRange'];
}) => {
  const isDiscount = compareAtPrice && compareAtPrice?.amount !== price?.amount;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <span>{priceRange?.minVariantPrice?.amount}</span>
        <span>{priceRange?.minVariantPrice?.currencyCode}</span>
      </Badge>
      {isDiscount && (
        <p className="text-xs text-gray-500 line-through">
          {compareAtPrice?.amount}
          {compareAtPrice?.currencyCode}
        </p>
      )}
    </div>
  );
};

export default Price;
