import styles from './Option.module.scss';

export default function Option({ option, handleClick, isSelected }) {
  return (
    Array.isArray(option.values) &&
    option.values.length > 1 && (
      <div className={styles.option}>
        <label className={styles.label} htmlFor="button-color-select">
          {option.name}
        </label>
        <ul className={styles.list}>
          {option.values.map((value) => (
            <li key={value}>
              <button
                type="button"
                id="button-color-select"
                className={
                  `${styles.button} ` +
                  `${isSelected(option.name, value) && styles.selectedOption}`
                }
                onClick={() => handleClick(value, option.name)}
              >
                {value}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
