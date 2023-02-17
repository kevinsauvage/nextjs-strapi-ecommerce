import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';
import { getFiltersFromQuery } from '@/helpers/index';
import styles from './FilterManager.module.scss';

export default function FilterManager() {
  const { applyFilters, resetFilters, isSelectionDifferent, allFilters } = useCollectionContext();
  const { query } = useRouter();

  return (
    <div className={styles.FilterManager}>
      <div className={styles.buttons}>
        <Button
          extraClass={styles.button}
          outlined
          type="button"
          onClick={resetFilters}
          disabled={!getFiltersFromQuery(allFilters, query).length}
        >
          Reset all
          <small>
            {getFiltersFromQuery(allFilters, query).length
              ? `(${getFiltersFromQuery(allFilters, query).length.toString()})`
              : null}
          </small>
        </Button>
        <Button
          extraClass={styles.button}
          type="button"
          primary
          onClick={applyFilters}
          disabled={!isSelectionDifferent()}
        >
          Apply filters
          <small>{isSelectionDifferent() ? `(${isSelectionDifferent().toString()})` : null}</small>
        </Button>
      </div>
    </div>
  );
}
