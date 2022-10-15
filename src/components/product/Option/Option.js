import styles from './Option.module.scss';

export default function Option({
  option,
  handleClick,
  isSelected,
  isOptionOutOfStock,
}) {
  return (
    Array.isArray(option.values) &&
    option.values.length > 1 && (
      <div className={styles.option}>
        <h6 className={styles.name}>{option.name}:</h6>
        <ul className={styles.list}>
          {option.values.map((value) => (
            <li key={value}>
              <button
                type="button"
                className={
                  `${styles.button} ` +
                  `${
                    isSelected(option.name, value) ? styles.selectedOption : ''
                  } ` +
                  `${
                    isOptionOutOfStock(option.name, value)
                      ? styles.outOfStock
                      : ''
                  }`
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
