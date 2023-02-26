import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { extractUniqueColorNames } from '@/helpers/index';
import PriceFilters from './PriceFilters/PriceFilters';
import styles from './Filters.module.scss';

const DefaultFilters = ({ filter }) => {
  const { handleSetFilters, isSelected } = useCollectionContext();

  return filter?.values?.map((value) => (
    <button
      key={value.label}
      style={{ backgroundColor: value.label }}
      className={`${styles.button} ${isSelected(filter.id, value.input) && styles.selected}`}
      type="button"
      onClick={() => handleSetFilters(filter.id, value.input)}
    >
      <p className={styles.value}>{value.label}</p>
    </button>
  ));
};

function ColorFilters({ filter }) {
  const { handleSetFilters, isSelected } = useCollectionContext();

  const colors = extractUniqueColorNames(filter.values);

  return colors.map((value) => (
    <button
      key={value.label}
      style={{ backgroundColor: value.label }}
      className={`${styles.button} ${styles.color} ${isSelected(filter.id, value.input) && styles.selected}`}
      type="button"
      onClick={() => handleSetFilters(filter.id, value.input)}
    >
      <div className={styles.value} />
    </button>
  ));
}

export default function Filters() {
  const { allFilters } = useCollectionContext();

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
      {Array.isArray(allFilters) &&
        allFilters.map((filter) => (
          <div className={styles.filterContainer} key={filter.label}>
            <b className={styles.label}>{filter.label}</b>
            <div className={styles.filter}>{getComponent(filter)}</div>
          </div>
        ))}
    </div>
  );
}
