import styles from './Filters.module.scss';

export default function Filters({ filters = [], filtersSelected, onChange }) {
  const isChecked = (valueId, filterId) => {
    const actualValues = filtersSelected[filterId];

    return Array.isArray(actualValues)
      ? actualValues.includes(valueId)
      : [actualValues].includes(valueId);
  };

  const handleChangeInput = (e) => e;

  return (
    <div className={styles.filters}>
      {filters
        .filter((item) => item.type === 'PRICE_RANGE')
        .map((filter) => (
          <div key={filter.label} className={styles.filter}>
            <h6 className={styles.title}>{filter.label}</h6>
            {filter.values.map((value) => (
              <label
                key={value.input}
                htmlFor={value.id}
                className={styles.label}
              >
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  name="range"
                  id={value.id}
                  value={value.id}
                  onChange={() => handleChangeInput(value.id, filter.id)}
                />
              </label>
            ))}
          </div>
        ))}
      {filters
        .filter((item) => item.type === 'LIST')
        .map(
          (filter) =>
            filter.values.length > 1 && (
              <div key={filter.label} className={styles.filter}>
                <h6 className={styles.title}>{filter.label}</h6>
                {filter.values.map((value) => (
                  <label
                    key={value.input}
                    htmlFor={value.id}
                    className={styles.label}
                  >
                    <input
                      type="checkbox"
                      name="filter"
                      id={value.id}
                      value={value.input}
                      onChange={() => onChange(value.id, filter.id)}
                      checked={isChecked(value.id, filter.id)}
                    />
                    <p className={styles.labelText}>{value.label}</p>
                    <small className={styles.count}>({value.count})</small>
                  </label>
                ))}
              </div>
            )
        )}
    </div>
  );
}
