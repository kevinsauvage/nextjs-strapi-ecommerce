import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Collapsible from '@/components/Collapsible/Collapsible';
import styles from './Filters.module.scss';
import FilterManager from './FilterManager/FilterManager';

export default function Filters() {
  const {
    selectedFilters,
    setSelectedFilters,
    removeFilter,
    actualFilters,
    allFilters,
  } = useCollectionContext();

  const isChecked = (valueId) => {
    if (!Array.isArray(selectedFilters)) return false;
    const res = selectedFilters?.some((filter) => filter.id === valueId);
    return res;
  };

  const filters = allFilters
    .filter((item) => item.type === 'LIST')
    .filter((item) => item.values.length > 1);

  return (
    <div className={styles.filters}>
      {actualFilters.length || selectedFilters.length ? (
        <FilterManager />
      ) : null}

      {Array.isArray(filters) &&
        filters.map((filter, i) => (
          <Collapsible
            key={filter.label}
            title={filter.label}
            last={i === filters.length - 1}
          >
            {filter.values.map((value) => (
              <label
                key={value.input}
                htmlFor={value.id}
                className={`${styles.label}`}
              >
                <button
                  className={styles.button}
                  type="button"
                  onClick={() =>
                    isChecked(value.id)
                      ? removeFilter(value.id)
                      : setSelectedFilters(value)
                  }
                >
                  {isChecked(value.id) ? (
                    <MdCheckBox size={20} color="purple" />
                  ) : (
                    <MdCheckBoxOutlineBlank size={20} />
                  )}
                </button>
                <p className={styles.labelText}>
                  <small>{value.label}</small>
                </p>
                <small className={styles.count}>({value.count})</small>
              </label>
            ))}
          </Collapsible>
        ))}
    </div>
  );
}
