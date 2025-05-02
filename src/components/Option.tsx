import { Button } from '@/components/ui/button';
import type { ProductFieldsFragment } from '@/shopify/storefront';

type OptionValues = ProductFieldsFragment['options'][number]['optionValues'][number];

const Option = ({
  option,
  onClick,
  isOptionOutOfStock,
  isOptionSelected,
}: {
  option: ProductFieldsFragment['options'][number];
  isOptionSelected: (id: string, optionValue: OptionValues) => boolean;
  isOptionOutOfStock: (id: string, optionValue: OptionValues) => boolean;
  onClick: (optionId: string, name: string, value: OptionValues) => void;
}) =>
  Array.isArray(option.optionValues) &&
  option.optionValues.length > 1 && (
    <div className="mb-2">
      <h3 className="text-sm font-medium">{option.name}:</h3>
      <ul className="flex items-center gap-2 flex-wrap">
        {option.optionValues.map((value) => (
          <li key={value.id}>
            <Button
              variant={
                isOptionOutOfStock(option.name, value)
                  ? 'destructive'
                  : isOptionSelected(option.id, value)
                    ? 'default'
                    : 'outline'
              }
              type="button"
              size="sm"
              disabled={isOptionOutOfStock(option.name, value)}
              onClick={() => onClick(option?.id, option.name, value)}
            >
              {value.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );

export default Option;
