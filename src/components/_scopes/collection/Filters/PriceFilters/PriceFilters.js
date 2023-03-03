import { useEffect, useState } from 'react';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { useRouter } from 'next/router';
import styles from './PriceFilters.module.scss';

function PriceFilters({ filter }) {
  const { handleSetUniqueFilters } = useCollectionContext();
  const [defaultValues, setDefaultValues] = useState();
  const [original, setOriginal] = useState({});
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const { query } = useRouter();

  useEffect(() => {
    const selected = query[filter?.id];
    const input = filter?.values?.[0]?.input;
    const price = input && JSON.parse(input).price;

    setOriginal(price);

    if (selected) {
      const parsed = JSON.parse(selected)?.price;
      setDefaultValues(parsed);
      setMin(parsed.min);
      setMax(parsed.max);
    } else {
      setDefaultValues(price);
      setMin(price.min);
      setMax(price.max);
    }
  }, [filter?.id, filter?.values, query]);

  const handleConfirm = (e) => {
    e.preventDefault();
    handleSetUniqueFilters(
      filter.id,
      JSON.stringify({ price: { min: parseInt(min, 10), max: parseInt(max, 10) } })
    );
  };

  return (
    defaultValues && (
      <form className={styles.priceFilters} onSubmit={handleConfirm}>
        <div className={styles.priceInputs}>
          <label className={styles.label}>
            <small>From</small>
            <input
              type="number"
              min={0}
              value={min}
              defaultValue={defaultValues.min}
              onChange={(e) => {
                setMin(e.target.value);
                handleSetUniqueFilters(
                  filter.id,
                  JSON.stringify({ price: { min: parseInt(e.target.value, 10), max: parseInt(max, 10) } })
                );
              }}
            />
          </label>
          <label className={styles.label}>
            <small>
              To <span>(Max {Math.ceil(original?.max)})</span>
            </small>
            <input
              type="number"
              max={Math.ceil(original?.max)}
              value={Math.ceil(max)}
              defaultValue={Math.ceil(defaultValues?.max)}
              onChange={(e) => {
                setMax(e.target.value);
                handleSetUniqueFilters(
                  filter.id,
                  JSON.stringify({ price: { min: parseInt(min, 10), max: parseInt(e.target.value, 10) } })
                );
              }}
            />
            <small />
          </label>
        </div>
      </form>
    )
  );
}

export default PriceFilters;
