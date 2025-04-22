'use client';

import type { Filter } from '@/shopify/storefront';

import styles from './DefaultFilters.module.scss';

const DefaultFilters = ({
  filter,
  handleSetFilters,
  isSelected,
}: {
  filter: Filter;
  handleSetFilters: (filterId: string, input: string) => void;
  isSelected: (filterId: string, input: string) => boolean;
}) => {
  console.log('🟩🟪🟦-->  ~ filter:', filter);
  return filter?.values?.map(
    (value) =>
      typeof value.input === 'string' && (
        <button
          key={value.label}
          aria-label={value.label}
          style={{ backgroundColor: value.label }}
          className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
          type="button"
          onClick={() =>
            typeof value.input === 'string' && handleSetFilters(filter.id, value.input)
          }
        >
          <p>{value.label}</p>
        </button>
      ),
  );
};

export default DefaultFilters;
