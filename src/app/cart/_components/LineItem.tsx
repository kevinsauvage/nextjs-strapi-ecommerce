import Image from 'next/image';

import { CartFieldsFragment } from '@/shopify/storefront';

import CartRemove from './CartRemove';
import QuantityUpdatedContainer from './QuantityUpdatedContainer';

type CartLineNode = CartFieldsFragment['lines']['edges'][number]['node'];

const LineItem: React.FC<{
  node: CartLineNode;
}> = ({ node }) => {
  if (!('merchandise' in node)) return null;

  const unitPrice =
    typeof node.merchandise.price.amount === 'string'
      ? Number.parseFloat(node.merchandise.price.amount)
      : 0;
  const totalPrice = unitPrice * node.quantity;

  const totalDiscount = node.discountAllocations.reduce(
    (accumulator: number, allocation) =>
      accumulator +
      Number.parseFloat(
        typeof allocation.discountedAmount.amount === 'string'
          ? allocation.discountedAmount.amount
          : '0.00',
      ),
    0,
  );
  const unitPriceFormatted = unitPrice.toFixed(2);
  const finalPrice = totalPrice - totalDiscount > 0 ? totalPrice - totalDiscount : 0;

  return (
    <div className="relative flex flex-col gap-2 md:flex-row md:items-center">
      <div className="flex gap-4 basis-1/2">
        <div className="shrink-0">
          {node.merchandise.image?.medium && (
            <Image
              src={String(node.merchandise.image.medium)}
              alt={node.merchandise.product.title}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{node.merchandise.product.title}</p>
          <div className="text-muted-foreground flex items-center">
            {node.merchandise.selectedOptions.map(
              (option: { name: string; value: string }, index: number) => (
                <div key={option.name} className="flex items-center">
                  <span className="block text-sm">{option.value}</span>
                  {index < node.merchandise.selectedOptions.length - 1 && (
                    <span className="block text-sm text-muted-foreground mx-2">/</span>
                  )}
                </div>
              ),
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {unitPriceFormatted} {node.merchandise.price.currencyCode}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-4 flex-1 min-w-0 md:justify-end">
        <QuantityUpdatedContainer
          originalQuantity={node.quantity}
          quantityAvailable={node.merchandise.quantityAvailable ?? 0}
          id={node.id}
          disabled={finalPrice <= 0}
        />
        <div className="flex flex-col items-end">
          <div className="text-right flex items-center gap-1">
            <p className="font-medium">{finalPrice.toFixed(2)}</p>
            <p className="font-medium">{node.merchandise.price.currencyCode}</p>
          </div>
          {finalPrice < totalPrice && (
            <p className="text-sm text-red-500 line-through">
              {totalPrice.toFixed(2)} {node.merchandise.price.currencyCode}
            </p>
          )}
        </div>

        <CartRemove id={node.id} />
      </div>
    </div>
  );
};

export default LineItem;
