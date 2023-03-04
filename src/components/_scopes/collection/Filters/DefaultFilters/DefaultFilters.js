import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

import styles from './DefaultFilters.module.scss';

const DefaultFilters = ({ filter }) => {
  const { handleSetFilters, isSelected } = useCollectionContext();

  return filter?.values?.map((value) => (
    <button
      key={value.label}
      style={{ backgroundColor: value.label }}
      className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
      type="button"
      onClick={() => handleSetFilters(filter.id, value.input)}
    >
      <p className={styles.value}>{value.label}</p>
    </button>
  ));
};

export default DefaultFilters;
