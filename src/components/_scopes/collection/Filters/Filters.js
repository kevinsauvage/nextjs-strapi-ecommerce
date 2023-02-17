import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { useCallback } from 'react';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import { useRouter } from 'next/router';
import { extractUniqueColorNames } from '@/helpers/index';
import styles from './Filters.module.scss';

export default function Filters() {
  const { selectedFilters, allFilters, dispatch } = useCollectionContext();
  const { query } = useRouter();

  const isAlreadyApplied = useCallback(
    (valueId) => {
      const res = selectedFilters.some((filter) => filter.id === valueId);
      return res;
    },
    [selectedFilters]
  );

  const isSelected = (valueId) => {
    let items;
    if (Array.isArray(query.filter)) items = query.filter;
    else if (query.filter && query.filter.length) items = query.filter;
    else items = [];
    const actualSelection = selectedFilters.filter((filter) => !items.includes(filter.id));
    const res = actualSelection?.some((filter) => JSON.stringify(filter.id) === JSON.stringify(valueId));
    return res;
  };

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
                  className={`${styles.button} ${isAlreadyApplied(value.id) && styles.checked} ${
                    isSelected(value.id) && styles.selected
                  }`}
                  type="button"
                  onClick={() =>
                    isAlreadyApplied(value.id) || isSelected(value.id)
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
    </div>
  );
}
