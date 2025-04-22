'use client';

import { useRouter } from 'next/navigation';

import Dropdown from '@/components/DropDown/DropDown';

import styles from './Sort.module.scss';

const Sort = ({
  query,
}: {
  query: {
    sort_key?: string;
  };
}) => {
  const router = useRouter();

  const handleChange = (value: string) => {
    const pathname = window.location.pathname;
    const searchParameters = new URLSearchParams();
    searchParameters.set('sort_key', value);
    router.push(`${pathname}?${searchParameters.toString()}`);
  };

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
