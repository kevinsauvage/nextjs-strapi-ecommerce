'use client';

import styles from './DefaultFilters.module.scss';

const DefaultFilters = ({ filter, handleSetFilters, isSelected }) => {
  return filter?.values?.map((value) => (
    <button
      key={value.label}
      aria-label={value.label}
      style={{ backgroundColor: value.label }}
      className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
      type="button"
      onClick={() => handleSetFilters(filter.id, value.input)}
    >
      <p>{value.label}</p>
    </button>
  ));
};

export default DefaultFilters;
