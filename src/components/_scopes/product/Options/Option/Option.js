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
        <b className={styles.name}>SELECT {option.name?.toUpperCase()}</b>
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
