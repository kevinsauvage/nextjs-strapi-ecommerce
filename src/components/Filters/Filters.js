import styles from './Filters.module.scss';

export default function Filters({ filters = [], filtersSelected, onChange }) {
  const isChecked = (key, value) => {
    const actualValues = filtersSelected[key];

    return Array.isArray(actualValues)
      ? actualValues.includes(value)
      : [actualValues].includes(value);
  };

  const handleChangeInput = (e) => {
    console.log(e);
  };

  return (
    <div className={styles.filters}>
      {filters
        .filter((item) => item.type === 'PRICE_RANGE')
        .map((filter) => (
          <div key={filter.label} className={styles.filter}>
            <h6 className={styles.title}>{filter.label}</h6>
            {console.log(filter)}
            {filter.values.map((value) => (
              // const input = JSON.parse(value.input);
              // console.log(input);
              <label key={value.id} htmlFor={value.id} className={styles.label}>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  name="range"
                  id={value.id}
                  value={value.label}
                  onChange={(e) => handleChangeInput(e.target.value, filter.id)}
                  checked={isChecked(filter.id, value.label)}
                />
                <p>{value.label}</p>
                <p>{value.count}</p>
              </label>
            ))}
          </div>
        ))}
      {filters
        .filter((item) => item.type === 'LIST')
        .map((filter) => (
          <div key={filter.label} className={styles.filter}>
            <h6 className={styles.title}>{filter.label}</h6>
            {filter.values.map((value) => (
              <label key={value.id} htmlFor={value.id} className={styles.label}>
                <input
                  type="checkbox"
                  name="filter"
                  id={value.id}
                  value={value.label}
                  onChange={(e) => onChange(e.target.value, filter.id)}
                  checked={isChecked(filter.id, value.label)}
                />
                <p>{value.label}</p>
                <p>{value.count}</p>
              </label>
            ))}
          </div>
        ))}
    </div>
  );
}
