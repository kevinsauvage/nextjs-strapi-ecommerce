import { MdOutlineRemove } from 'react-icons/md';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import styles from './FilterManager.module.scss';

export default function FilterManager() {
  const {
    applyFilters,
    selectedFilters,
    removeFilter,
    resetFilters,
    isSelectionDifferent,
  } = useCollectionContext();
  return (
    <div className={styles.FilterManager}>
      <div className={styles.filters}>
        <p className={styles.title}>Filter selection</p>
        <div className={styles.actualFilters}>
          {Array.isArray(selectedFilters) &&
            selectedFilters.map((item) => (
              <span
                className={styles.filter}
                onClick={() => removeFilter(item.id)}
                onKeyDown={() => removeFilter(item.id)}
                key={item.id}
                role="button"
                tabIndex={0}
              >
                {item.label}
                <MdOutlineRemove />
              </span>
            ))}
        </div>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} type="button" onClick={resetFilters}>
          Reset all
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={applyFilters}
          disabled={!isSelectionDifferent()}
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
