'use client';

import { extractUniqueColorNames } from '@/utils/products';

import styles from './ColorFilters.module.scss';

function ColorFilters({ filter, handleSetFilters, isSelected }) {
  const colors = extractUniqueColorNames(filter.values);

  return colors.map((value) => (
    <button
      key={value.label}
      aria-label={value.label}
      style={{ backgroundColor: value.label }}
      className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
      type="button"
      onClick={() => handleSetFilters(filter.id, value.input)}
    >
      <div />
    </button>
  ));
}

export default ColorFilters;
