'use client';

import type { Filter } from '@/shopify/storefront';
import { extractUniqueColorNames } from '@/utils/products';

import styles from './ColorFilters.module.scss';

function ColorFilters({
  filter,
  handleSetFilters,
  isSelected,
}: {
  filter: Filter;
  isSelected: (id: string, value: string) => boolean;
  handleSetFilters: (id: string, value: string) => void;
}) {
  const colors = extractUniqueColorNames(filter.values);

  return colors
    .map(
      (value) =>
        typeof value?.input === 'string' && (
          <button
            key={value.label}
            aria-label={value.label}
            style={{ backgroundColor: value.label }}
            className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
            type="button"
            onClick={() =>
              typeof value?.input === 'string' && handleSetFilters(filter.id, value.input)
            }
          >
            <div />
          </button>
        ),
    )
    .filter(Boolean);
}

export default ColorFilters;
