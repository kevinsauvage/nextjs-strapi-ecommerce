import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { useCallback } from 'react';
import styles from './Filters.module.scss';
import FilterManager from './FilterManager/FilterManager';

export default function Filters() {
  const { selectedFilters, setSelectedFilters, removeFilter, actualFilters, allFilters } =
    useCollectionContext();

  const isChecked = useCallback(
    (valueId) => {
      if (!Array.isArray(selectedFilters)) return false;
      const res = selectedFilters?.some((filter) => filter.id === valueId);
      return res;
    },
    [selectedFilters]
  );

  const filters = allFilters.filter((item) => item.type === 'LIST').filter((item) => item.values.length > 1);

  return (
    <div className={styles.filters}>
      {Array.isArray(filters) &&
        filters.map((filter) => (
          <div className={styles.filterContainer} key={filter.label}>
            <h6 className={styles.label}>{filter.label}</h6>
            <div className={styles.filter}>
              {filter.values.map((value) => (
                <button
                  key={value.label}
                  className={`${styles.button} ${isChecked(value.id) && styles.checked}`}
                  type="button"
                  onClick={() =>
                    isChecked(value.id)
                      ? removeFilter(value.id)
                      : setSelectedFilters([...selectedFilters, value])
                  }
                >
                  <p className={styles.value}>{value.label}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      {actualFilters.length || selectedFilters.length ? <FilterManager /> : null}
    </div>
  );
}
