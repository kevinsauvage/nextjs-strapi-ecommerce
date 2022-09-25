import styles from './Filters.module.scss';

export default function Filters({ filters = [], filtersSelected, onChange }) {
  const isChecked = (input) => {
    const key = Object.keys(JSON.parse(input));
    const actualValues = filtersSelected[key];
    const normalizedInput = JSON.stringify(JSON.parse(input));

    return Array.isArray(actualValues)
      ? actualValues.includes(normalizedInput)
      : [actualValues].includes(normalizedInput);
  };

  const handleChangeInput = (e) => {
    console.log(e);
  };
  console.log(filters);

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
                  value={value.input}
                  onChange={(e) =>
                    handleChangeInput(JSON.parse(e.target.value))
                  }
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
                      onChange={(e) => onChange(JSON.parse(e.target.value))}
                      checked={isChecked(value.input)}
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
