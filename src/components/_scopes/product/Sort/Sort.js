import styles from './Sort.module.scss';

export default function Sort({ handleChange }) {
  const sortingOptions = [
    { label: 'RELEVANCE', name: 'Relevance' },
    { label: 'BEST_SELLING', name: 'Best selling' },
    { label: 'PRICE', name: 'Price Ascending' },
  ];

  return (
    <label className={styles.sort} htmlFor="sort">
      <p className={styles.label}>Sort By</p>
      <select
        id="sort"
        aria-label="sort"
        selected={sortingOptions[0].label}
        onChange={(event) => handleChange(event.target.value)}
        className={styles.select}
      >
        {sortingOptions.map((option) => (
          <option
            key={option.name}
            value={option.label}
            className={styles.option}
          >
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
