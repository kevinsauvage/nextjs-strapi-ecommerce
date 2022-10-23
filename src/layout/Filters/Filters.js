import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import MultiRangeSlider from '@/components/MultiRangeSlider/MultiRangeSlider';
import Collapsible from '../Collapsible/Collapsible';
import styles from './Filters.module.scss';

export default function Filters({
  filters = [],
  filtersSelected,
  onChange,
  addUniqueParam,
}) {
  const isChecked = (input, filterId) => {
    const actualValues = filtersSelected[filterId];

    return Array.isArray(actualValues)
      ? actualValues.includes(input)
      : [actualValues].includes(input);
  };

  return (
    <div className={styles.filters}>
      {filters
        .filter((item) => item.type === 'PRICE_RANGE')
        .map((filter) => (
          <Collapsible key={filter.label} title={filter.label}>
            {filter.values.map((value) => (
              <MultiRangeSlider
                key={value}
                min={JSON.parse(value?.input)?.price?.min}
                max={JSON.parse(value?.input)?.price?.max}
                onChange={({ min, max }) =>
                  addUniqueParam(
                    filter.id,
                    JSON.stringify({ price: { min, max } })
                  )
                }
              />
            ))}
          </Collapsible>
        ))}
      {filters
        .filter((item) => item.type === 'LIST')
        .map(
          (filter) =>
            filter.values.length > 1 && (
              <Collapsible key={filter.label} title={filter.label}>
                {filter.values.map((value) => (
                  <label
                    key={value.input}
                    htmlFor={value.id}
                    className={styles.label}
                  >
                    <button
                      className={styles.button}
                      type="button"
                      onClick={() => onChange(value.input, filter.id)}
                    >
                      {isChecked(value.input, filter.id) ? (
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
            )
        )}
    </div>
  );
}
