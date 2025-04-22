import { useEffect, useState } from 'react';
import type { Filter } from '@/shopify/storefront';

import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './PriceFilters.module.scss';

const PriceFilters = ({
  filter,
  handleSetUniqueFilters,
  query,
}: {
  filter: Filter;
  handleSetUniqueFilters: (id: string, value: string) => void;
  query: Record<string, string>;
}) => {
  const [original, setOriginal] = useState<{ max: number; min: number }>({
    max: 1000,
    min: 0,
  });
  const [min, setMin] = useState<number | undefined>(0);
  const [max, setMax] = useState<number | undefined>(1000);
  const { showToast } = useToastContext();

  useEffect(() => {
    const selected = query[filter?.id];
    const input = filter?.values?.find((value) => value.id === filter.id)?.input as string;
    const price = input
      ? (JSON.parse(input) as { price: { min: number; max: number } }).price
      : undefined;

    setOriginal(price);

    if (selected) {
      const parsed = (JSON.parse(selected) as { price: { min: number; max: number } })?.price;
      setMin(parsed.min || 0);
      setMax(parsed.max || 1000);
      return;
    }

    setMin(price?.min || 0);
    setMax(price?.max || 1000);
  }, [filter?.id, filter?.values, query]);

  const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (min < 0) return showToast.error('Minimum value must be greater than or equal to 0');
    if (min > max) return showToast.error('Min value must be greater than max');
    if (max > original?.max)
      return showToast.error(`Max value must be greater than ${original.max}`);

    return handleSetUniqueFilters(filter.id, JSON.stringify({ price: { max, min } }));
  };

  return (
    original?.max && (
      <form className={styles['price-filters']} onSubmit={(event) => handleConfirm(event)}>
        <div className={styles['price-inputs']}>
          <label className={styles.label}>
            <small>From</small>
            <input
              type="number"
              value={min.toString()}
              onChange={(event) => {
                setMin(Number(event.target.value || 0));
                handleSetUniqueFilters(
                  filter.id,
                  JSON.stringify({
                    price: {
                      max: Number(max),
                      min: Number(event.target.value || 0),
                    },
                  }),
                );
              }}
            />
          </label>
          <label className={styles.label}>
            <small>To</small>
            <input
              type="number"
              value={Math.ceil(max).toString()}
              onChange={(event) => {
                setMax(Number(event.target.value || 0));
                handleSetUniqueFilters(
                  filter.id,
                  JSON.stringify({
                    price: {
                      max: Number(event.target.value || 0),
                      min: Number(min),
                    },
                  }),
                );
              }}
            />
            <small />
          </label>
        </div>
      </form>
    )
  );
};

export default PriceFilters;
