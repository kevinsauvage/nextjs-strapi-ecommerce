import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { useCallback } from 'react';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import { extractUniqueColorNames } from '@/lib/shopify/helpers';
import styles from './Filters.module.scss';
import FilterManager from './FilterManager/FilterManager';

export default function Filters() {
  const { selectedFilters, allFilters, dispatch } = useCollectionContext();

  console.log('🚀 ~ file: Filters.js:11 ~ Filters ~ allFilters', allFilters);

  const isChecked = useCallback(
    (valueId) => {
      if (!Array.isArray(selectedFilters)) return false;
      const res = selectedFilters?.some((filter) => JSON.stringify(filter.id) === JSON.stringify(valueId));
      return res;
    },
    [selectedFilters]
  );

  const filters = allFilters.filter((item) => item.type === 'LIST').filter((item) => item.values.length > 1);

  const getValues = (id, values) => {
    if (id.includes('color')) return extractUniqueColorNames(values);
    return values;
  };

  return (
    <div className={styles.filters}>
      {Array.isArray(filters) &&
        filters.map((filter) => (
          <div className={styles.filterContainer} key={filter.label}>
            <b className={styles.label}>{filter.label}</b>
            <div className={styles.filter}>
              {getValues(filter.id, filter.values).map((value) => (
                <button
                  key={value.label}
                  className={`${styles.button} ${isChecked(value.id) && styles.checked}`}
                  type="button"
                  onClick={() =>
                    isChecked(value.id)
                      ? dispatch({
                          type: actions.SET_SELECTED_FILTERS,
                          payload: selectedFilters.filter((f) => f.id !== value.id),
                        })
                      : dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [...selectedFilters, value] })
                  }
                >
                  <p className={styles.value}>{value.label}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      <FilterManager />
    </div>
  );
}
