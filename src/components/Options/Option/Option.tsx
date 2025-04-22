import type { ProductFieldsFragment } from '@/shopify/storefront';

import styles from './Option.module.scss';

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
    <div className={styles.option}>
      <b className={styles.name}>SELECT {option.name?.toUpperCase()}</b>
      <ul className={styles.list}>
        {option.optionValues.map((value) => (
          <li key={value.id}>
            <button
              type="button"
              disabled={isOptionOutOfStock(option.name, value)}
              className={`${styles.button} ${
                isOptionSelected(option.id, value) ? styles['selected-option'] : ''
              } `}
              onClick={() => onClick(option?.id, option.name, value)}
            >
              {value.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

export default Option;
