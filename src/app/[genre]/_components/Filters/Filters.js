'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import { numberOfDifferences } from '@/utils/array';

import ColorFilters from './ColorFilters/ColorFilters';
import DefaultFilters from './DefaultFilters/DefaultFilters';
import Filter from './Filter/Filter';
import PriceFilters from './PriceFilters/PriceFilters';

import styles from './Filters.module.scss';

const shouldDisplayFilter = (filter) => {
  if (filter.type === 'PRICE_RANGE') {
    return true;
  }

  return filter.values?.length > 1;
};

const Filters = ({ filters, query }) => {
  const [currentFilters, setCurrentFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const pathname = usePathname();
  const { push } = useRouter();

  const isSelected = useCallback(
    (filterId, input) =>
      selectedFilters?.some((filter) => filter.input === input && filter.filterId === filterId),
    [selectedFilters]
  );

  const handleSetUniqueFilters = useCallback(
    async (filterId, input) => {
      const newFilters = selectedFilters.filter((filter) => filter.filterId !== filterId);
      setSelectedFilters([...newFilters, { filterId, input }]);
    },
    [selectedFilters]
  );

  const handleSetFilters = useCallback(
    (filterId, input) => {
      if (isSelected(filterId, input)) {
        const newFilters = selectedFilters.filter((filter) => {
          if (filter.filterId !== filterId) return true;
          return filter.input !== input;
        });

        setSelectedFilters(newFilters);
      } else {
        setSelectedFilters([...selectedFilters, { filterId, input }]);
      }
    },
    [isSelected, selectedFilters]
  );

  const resetFilters = () => {
    const newSearchParameters = new URLSearchParams(query);
    newSearchParameters.delete('filters');
    push(`${pathname}?${newSearchParameters.toString()}`);
  };

  const applyFilters = () => {
    const newSearchParameters = new URLSearchParams(query);
    newSearchParameters.delete('filters');

    selectedFilters.forEach((filter) => {
      newSearchParameters.append('filters', `${filter.filterId}:${filter.input}`);
    });

    push(`${pathname}?${newSearchParameters.toString()}`);
  };

  const isSelectionDifferent = useCallback(() => {
    return numberOfDifferences(currentFilters, selectedFilters) > 0;
  }, [currentFilters, selectedFilters]);

  const getComponent = (filter) => {
    const components = {
      'filter.v.option.color': (
        <ColorFilters filter={filter} handleSetFilters={handleSetFilters} isSelected={isSelected} />
      ),
      'filter.v.price': (
        <PriceFilters
          filter={filter}
          query={query}
          handleSetUniqueFilters={handleSetUniqueFilters}
        />
      ),
    };

    const component = components[filter?.id];

    return (
      component || (
        <DefaultFilters
          filter={filter}
          handleSetFilters={handleSetFilters}
          isSelected={isSelected}
        />
      )
    );
  };

  const handleSetCurrentFilters = useCallback(() => {
    const currentFilters_ = typeof query.filters === 'string' ? [query.filters] : query.filters;

    const f = currentFilters_?.map((filter) => {
      const [filterId, input] = filter.split(/:(.+)/);
      return { filterId, input };
    });

    setCurrentFilters(f || []);
    setSelectedFilters(f || []);
  }, [query.filters]);

  useEffect(() => {
    handleSetCurrentFilters();
  }, [handleSetCurrentFilters]);

  return (
    <div>
      <div className={styles.header}>
        <button className={styles.reset} onClick={resetFilters} type="button">
          Reset all filters
        </button>
      </div>

      {Array.isArray(filters) &&
        filters.map(
          (filter) =>
            shouldDisplayFilter(filter) && (
              <Filter key={filter.id} filter={filter}>
                {getComponent(filter)}
              </Filter>
            )
        )}

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
