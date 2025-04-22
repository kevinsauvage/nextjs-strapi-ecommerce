'use client';

import { useRouter } from 'next/navigation';

import Dropdown from '@/components/DropDown/DropDown';

import styles from './Sort.module.scss';

const Sort = ({
  query,
  sortingOptions,
}: {
  query: {
    sort_key?: string;
  };
  sortingOptions: { label: string; name: string }[];
}) => {
  console.log('🟩🟪🟦-->  ~ sortingOptions:', sortingOptions);
  const router = useRouter();

  const handleChange = (value: string) => {
    const pathname = window.location.pathname;
    const searchParameters = new URLSearchParams();
    searchParameters.set('sort_key', value);
    router.push(`${pathname}?${searchParameters.toString()}`);
  };

  return (
    <div className={styles.sort}>
      <small>Sort by </small>
      <Dropdown
        options={sortingOptions}
        changeCallback={handleChange}
        selected={sortingOptions.find(
          (item) => item.name.toLowerCase() === query.sort_key.toLowerCase(),
        )}
      />
    </div>
  );
};

export default Sort;
