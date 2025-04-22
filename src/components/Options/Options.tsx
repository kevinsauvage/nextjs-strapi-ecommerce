import type { ProductFieldsFragment } from '@/shopify/storefront';

import Option from './Option/Option';

type OptionValues = ProductFieldsFragment['options'][number]['optionValues'][number];

const Options = ({
  options,
  onClick,
  isOptionSelected,
  isOptionOutOfStock,
  styles,
}: {
  options: ProductFieldsFragment['options'];
  onClick: (id: string, name: string, value: OptionValues) => void;
  isOptionSelected: (id: string, value: OptionValues) => boolean;
  isOptionOutOfStock: (id: string, value: OptionValues) => boolean;
  styles?: string;
}) =>
  Array.isArray(options) && (
    <div className={styles}>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          onClick={onClick}
          isOptionSelected={isOptionSelected}
          isOptionOutOfStock={isOptionOutOfStock}
        />
      ))}
    </div>
  );

export default Options;
