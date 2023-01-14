import Dropdown from '@/components/DropDown/DropDown';
import { useRouter } from 'next/router';
import styles from './Sort.module.scss';

export default function Sort({ handleChange }) {
  const { query } = useRouter();

  const sortingOptions = [
    { label: 'RELEVANCE', name: 'Relevance' },
    { label: 'BEST_SELLING', name: 'Best selling' },
    { label: 'PRICE', name: 'Price Ascending' },
  ];

  return (
    <div className={styles.sort}>
      <p>Sort by </p>
      <Dropdown
        options={sortingOptions}
        changeCallback={handleChange}
        selected={
          sortingOptions.filter((item) => item.label === query.sort_key)[0]
        }
      />
    </div>
  );
}
