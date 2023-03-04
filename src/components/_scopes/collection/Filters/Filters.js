import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { getSelectedFilter } from '@/helpers/index';

import ColorFilters from './ColorFilters/ColorFilters';
import DefaultFilters from './DefaultFilters/DefaultFilters';
import Filter from './Filter/Filter';
import PriceFilters from './PriceFilters/PriceFilters';

import styles from './Filters.module.scss';

export default function Filters() {
  const { allFilters, applyFilters, isSelectionDifferent, resetFilters } = useCollectionContext();
  const { query } = useRouter();

  const getComponent = (filter) => {
    const components = {
      'filter.v.option.color': <ColorFilters filter={filter} />,
      'filter.v.price': <PriceFilters filter={filter} />,
    };

    const component = components[filter?.id];

    return component || <DefaultFilters filter={filter} />;
  };

  return (
    <div className={styles.filters}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Filters{' '}
          <small>
            {getSelectedFilter(allFilters, query).length
              ? `(${getSelectedFilter(allFilters, query).length.toString()})`
              : null}
          </small>
        </h3>
        {getSelectedFilter(allFilters, query).length ? (
          <button className={styles.reset} type="button" onClick={resetFilters}>
            Reset all
          </button>
        ) : null}
      </div>
      {Array.isArray(allFilters) &&
        allFilters.map((filter) => (
          <Filter key={filter.id} filter={filter}>
            {getComponent(filter)}
          </Filter>
        ))}

      <div className={styles.bottom}>
        <Button
          extraClass={styles.button}
          type="button"
          primary
          onClick={applyFilters}
          disabled={!isSelectionDifferent()}
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
}
