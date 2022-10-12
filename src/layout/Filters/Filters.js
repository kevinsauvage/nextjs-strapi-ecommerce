import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import MultiRangeSlider from '@/components/MultiRangeSlider/MultiRangeSlider';
import Collapsible from '../Collapsible/Collapsible';
import styles from './Filters.module.scss';

export default function Filters({ filters = [], filtersSelected, onChange }) {
  const isChecked = (valueId, filterId) => {
    const actualValues = filtersSelected[filterId];

    return Array.isArray(actualValues)
      ? actualValues.includes(valueId)
      : [actualValues].includes(valueId);
  };

  const handleChangeInput = (valueId) => {
    console.log(valueId);
  };

  console.log(filters);

  const getMinValue = (input) => JSON.parse(input).price.min;
  const getMaxValue = (input) => JSON.parse(input).price.max;

  return (
    <div className={styles.filters}>
      {filters
        .filter((item) => item.type === 'PRICE_RANGE')
        .map((filter) => (
          <Collapsible key={filter.label} title={filter.label}>
            {filter.values.map((value) => (
              <MultiRangeSlider
                key={value}
                min={getMinValue(value.input)}
                max={getMaxValue(value.input)}
                onChange={({ min, max }) =>
                  handleChangeInput(value.id, filter.id, min, max)
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
                      onClick={() => onChange(value.id, filter.id)}
                    >
                      {isChecked(value.id, filter.id) ? (
                        <MdCheckBox size={20} color="purple" />
                      ) : (
                        <MdCheckBoxOutlineBlank size={20} />
                      )}
                    </button>
                    <p className={styles.labelText}>{value.label}</p>
                    <small className={styles.count}>({value.count})</small>
                  </label>
                ))}
              </Collapsible>
            )
        )}
    </div>
  );
}
