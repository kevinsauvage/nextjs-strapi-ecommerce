import styles from './SelectedOptions.module.scss';

export default function SelectedOptions({ options }) {
  return (
    Array.isArray(options) &&
    options.length && (
      <div className={styles.selectedOptions}>
        {options.map((option) => (
          <div key={option.value} className={styles.option}>
            <p className={styles.name}>{option.name}:</p>
            <p className={styles.value}>{option.value}</p>
          </div>
        ))}
      </div>
    )
  );
}
