'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import type { Filter } from '@/shopify/storefront';
import { FilterType } from '@/shopify/storefront';
import { numberOfDifferences } from '@/utils/array';

import ColorFilters from './ColorFilters/ColorFilters';
import DefaultFilters from './DefaultFilters/DefaultFilters';
import FilterComponent from './Filter/Filter';
import PriceFilters from './PriceFilters/PriceFilters';

import styles from './Filters.module.scss';

const shouldDisplayFilter = (filter: Filter) => {
  if (filter.type === FilterType.PriceRange) {
    return true;
  }

  return filter.values?.length > 1;
};

const Filters = ({
  filters,
  query,
}: {
  filters: Filter[];
  query: {
    after?: string;
    before?: string;
    filters?: string;
    sort_key?: string;
  };
}) => {
  const [currentFilters, setCurrentFilters] = useState<{ filterId: string; input: string }[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{ filterId: string; input: string }[]>([]);

  const pathname = usePathname();
  const router = useRouter();

  const isSelected = useCallback(
    (filterId: string, input: string) =>
      selectedFilters?.some((filter) => filter.input === input && filter.filterId === filterId),
    [selectedFilters],
  );

  const handleSetUniqueFilters = useCallback(
    (filterId: string, input: string) => {
      const newFilters = selectedFilters.filter((filter) => filter.filterId !== filterId);
      setSelectedFilters([...newFilters, { filterId, input }]);
    },
    [selectedFilters],
  );

  const handleSetFilters = useCallback(
    (filterId: string, input: string) => {
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
    [isSelected, selectedFilters],
  );

  const resetFilters = () => {
    const newSearchParameters = new URLSearchParams(query);
    newSearchParameters.delete('filters');
    router.push(`${pathname}?${newSearchParameters.toString()}`);
  };

  const applyFilters = () => {
    const newSearchParameters = new URLSearchParams(query);
    newSearchParameters.delete('filters');

    selectedFilters.forEach((filter) => {
      newSearchParameters.append('filters', `${filter.filterId}:${filter.input}`);
    });

    router.push(`${pathname}?${newSearchParameters.toString()}`);
  };

  const isSelectionDifferent = useCallback(() => {
    return numberOfDifferences(currentFilters, selectedFilters) > 0;
  }, [currentFilters, selectedFilters]);

  const getComponent = (filter: Filter) => {
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

    if (!components[filter?.id as keyof typeof components]) {
      return;
    }
    const component = components[filter?.id as keyof typeof components];

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
              <FilterComponent key={filter.id} filter={filter}>
                {getComponent(filter)}
              </FilterComponent>
            ),
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
