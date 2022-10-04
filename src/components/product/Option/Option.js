import styles from './Option.module.scss';

export default function Option({ option, handleClick, isSelected }) {
  return (
    Array.isArray(option.values) &&
    option.values.length > 0 && (
      <div className={styles.option}>
        <div className={styles.button}>
          <label className={styles.label} htmlFor="button-color-select">
            {option.name}
          </label>
          {option.values.map((value) => (
            <button
              type="button"
              id="button-color-select"
              key={value}
              className={
                `${styles.button} ` +
                `${isSelected(option.name, value) && styles.selectedOption}`
              }
              onClick={() => handleClick(value, option.name)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    )
  );
}
