import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Button from '@/components/Button/Button';
import styles from './FilterManager.module.scss';

export default function FilterManager() {
  const { applyFilters, resetFilters, isSelectionDifferent } = useCollectionContext();

  return (
    <div className={styles.FilterManager}>
      <div className={styles.buttons}>
        <Button extraClass={styles.button} outlined type="button" onClick={resetFilters}>
          Reset all
        </Button>
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
