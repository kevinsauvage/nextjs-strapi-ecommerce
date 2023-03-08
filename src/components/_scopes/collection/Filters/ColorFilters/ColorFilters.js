import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { extractUniqueColorNames } from '@/helpers/index';

import styles from './ColorFilters.module.scss';

function ColorFilters({ filter }) {
  const { handleSetFilters, isSelected } = useCollectionContext();

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
      <div className={styles.value} />
    </button>
  ));
}

export default ColorFilters;
