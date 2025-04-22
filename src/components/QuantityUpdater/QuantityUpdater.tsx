'use client';

import { useEffect, useRef, useState } from 'react';
import { VscAdd, VscRemove } from 'react-icons/vsc';
import { usePathname } from 'next/navigation';

import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './QuantityUpdater.module.scss';

const QuantityUpdater = ({
  originalQuantity,
  onChange,
  quantityAvailable,
  extraStyles,
  showTitle = true,
  maxQuantity = 100,
}: {
  originalQuantity: number;
  onChange: (newQuantity: number) => void;
  quantityAvailable: number;
  extraStyles?: string;
  showTitle?: boolean;
  maxQuantity?: number;
}) => {
  const [quantity, setQuantity] = useState(originalQuantity);
  const input = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToastContext();
  const pathname = usePathname();

  useEffect(() => {
    setQuantity(originalQuantity);
  }, [pathname, originalQuantity]);

  const addOne = () => {
    if (quantity >= quantityAvailable) return;
    onChange(Number(quantity + 1));
    setQuantity((previous) => Number(previous) + 1);
  };

  const removeOne = () => {
    if (quantity > 1) {
      onChange(Number(quantity - 1));
      setQuantity((previous) => Number(previous) - 1);
    }
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number_ = event.target.value;
    if (Number(number_) > quantityAvailable) {
      setQuantity(quantityAvailable);
      showToast.error(`There is Only ${quantityAvailable} variant available`);
      return;
    }
    if (Number(number_) <= Number(originalQuantity)) setQuantity(Number(number_));
  };

  const handleConfirmInput = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.target.value) setQuantity(Number(originalQuantity));
    else if (quantity !== originalQuantity) onChange(Number(quantity));
  };

  return (
    <div className={`${styles.container} ${extraStyles}`}>
      {showTitle && <b className={styles.label}>SELECT QUANTITY</b>}
      <div className={styles.box}>
        <button
          type="button"
          onClick={removeOne}
          className={styles.button}
          disabled={quantity <= 1}
        >
          <VscRemove />
        </button>
        <input
          id="quantity"
          name="quantity"
          type="number"
          ref={input}
          size={4}
          className={styles.input}
          min={1}
          max={maxQuantity}
          onChange={handleChangeInput}
          onBlur={handleConfirmInput}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === 'Enter' && input.current?.blur()
          }
          value={quantity}
          disabled={quantity <= 1 && quantity >= quantityAvailable}
        />
        <button
          type="button"
          onClick={addOne}
          className={styles.button}
          disabled={quantity >= quantityAvailable}
        >
          <VscAdd />
        </button>
      </div>
    </div>
  );
};

export default QuantityUpdater;
