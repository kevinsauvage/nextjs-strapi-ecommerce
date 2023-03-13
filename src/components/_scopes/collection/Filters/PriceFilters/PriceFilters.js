import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './PriceFilters.module.scss';

function PriceFilters({ filter }) {
  const { handleSetUniqueFilters } = useCollectionContext();
  const [original, setOriginal] = useState({});
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const { query } = useRouter();
  const { showToast } = useToastContext();

  useEffect(() => {
    const selected = query[filter?.id];
    const input = filter?.values?.[0]?.input;
    const price = input && JSON.parse(input).price;

    setOriginal(price);

    if (selected) {
      const parsed = JSON.parse(selected)?.price;
      setMin(parsed.min);
      setMax(parsed.max);
      return;
    }
    setMin(price.min);
    setMax(price.max);
  }, [filter?.id, filter?.values, query]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (min < 0) return showToast.error('Minimum value must be greater than or equal to 0');
    if (min > max) return showToast.error('Min value must be greater than max');
    if (max > original?.max) return showToast.error(`Max value must be greater than ${original.max}`);

    return handleSetUniqueFilters(
      filter.id,
      JSON.stringify({ price: { min: parseInt(min, 10), max: parseInt(max, 10) } })
    );
  };

  return (
    original?.max && (
      <form className={styles.priceFilters} onSubmit={(e) => handleConfirm(e)}>
        <div className={styles.priceInputs}>
          <label className={styles.label}>
            <small>From</small>
            <input
              type="number"
              value={min.toString()}
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
              value={Math.ceil(max).toString()}
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
