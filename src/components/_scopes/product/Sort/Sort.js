import { useRouter } from 'next/router';

import Dropdown from '@/components/DropDown/DropDown';

import styles from './Sort.module.scss';

const Sort = ({ handleChange }) => {
  const { query } = useRouter();

  const sortingOptions = [
    { label: 'RELEVANCE', name: 'Relevance' },
    { label: 'BEST_SELLING', name: 'Best selling' },
    { label: 'PRICE', name: 'Price Ascending' },
  ];

  return (
    <div className={styles.sort}>
      <small>Sort by </small>
      <Dropdown
        options={sortingOptions}
        changeCallback={handleChange}
        selected={sortingOptions.find((item) => item.label === query.sort_key)}
      />
    </div>
  );
};

export default Sort;
