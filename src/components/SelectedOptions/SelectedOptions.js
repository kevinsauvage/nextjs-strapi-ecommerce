import styles from './SelectedOptions.module.scss';

export default function SelectedOptions({ options }) {
  return (
    Array.isArray(options) &&
    options.length && (
      <div className={styles.selectedOptions}>
        {options.map((option) => (
          <div key={option.values} className={styles.option}>
            <h6 className={styles.name}>{option.name}:</h6>
            <p className={styles.value}>{option.value}</p>
          </div>
        ))}
      </div>
    )
  );
}
