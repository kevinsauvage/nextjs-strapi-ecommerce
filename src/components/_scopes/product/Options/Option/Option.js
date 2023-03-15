import styles from './Option.module.scss';

const Option = ({ option, handleClick, isSelected, isOptionOutOfStock }) =>
  Array.isArray(option.values) &&
  option.values.length > 1 && (
    <div className={styles.option}>
      <b className={styles.name}>SELECT {option.name?.toUpperCase()}</b>
      <ul className={styles.list}>
        {option.values.map((value) => (
          <li key={value}>
            <button
              type="button"
              disabled={isOptionOutOfStock(option.name, value)}
              className={`${styles.button} ${
                isSelected(option.name, value) ? styles['selected-option'] : ''
              } `}
              onClick={() => !isOptionOutOfStock(option.name, value) && handleClick(value, option.name)}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

export default Option;
