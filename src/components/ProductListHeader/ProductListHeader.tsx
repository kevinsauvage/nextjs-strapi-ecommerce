import Filters from '@/app/[genre]/_components/Filters/Filters';
import Sort from '@/app/[genre]/_components/Sort/Sort';
import { filter } from '@/assets/svg';
import type { Filter } from '@/shopify/storefront';

import SlideIn from '../SlideIn/SlideIn';

import styles from './ProductListHeader.module.scss';

const ProductListHeader = ({
  searchParameters,
  sortingOptions,
  filters,
  sortQuery,
}: {
  searchParameters: {
    after?: string;
    before?: string;
    first?: string;
    last?: string;
    sort_key?: string;
  };
  sortingOptions: Array<{ label: string; name: string }>;
  filters: Filter[];
  sortQuery: {
    sort_key: string;
  };
}) => {
  return (
    <div className={styles.search__header}>
      <Sort query={sortQuery} sortingOptions={sortingOptions} />

      <SlideIn
        headerTitle="Filters"
        title={
          <span className={styles.filter__button}>
            <p>Filters</p>
            {filter}
          </span>
        }
      >
        <Filters filters={filters} query={searchParameters} />
      </SlideIn>
    </div>
  );
};
export default ProductListHeader;
