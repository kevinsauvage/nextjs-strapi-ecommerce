import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { getSelectedFilter } from '@/helpers/index';

import ColorFilters from './ColorFilters/ColorFilters';
import DefaultFilters from './DefaultFilters/DefaultFilters';
import Filter from './Filter/Filter';
import PriceFilters from './PriceFilters/PriceFilters';

import styles from './Filters.module.scss';

const Filters = () => {
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
    <div>
      <div className={styles.header}>
        <button
          className={styles.reset}
          disabled={!getSelectedFilter(allFilters, query).length}
          onClick={resetFilters}
          type="button"
        >
          Reset all {` (${getSelectedFilter(allFilters, query).length.toString()})`}
        </button>
      </div>

      {Array.isArray(allFilters) &&
        allFilters.map((filter) => (
          <Filter key={filter.id} filter={filter}>
            {getComponent(filter)}
          </Filter>
        ))}

      <div className={styles.bottom}>
        <Button
          disabled={!isSelectionDifferent()}
          extraClass={styles.button}
          onClick={applyFilters}
          primary
          type="button"
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;
