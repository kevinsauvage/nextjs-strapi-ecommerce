import { useEffect, useRef, useState } from 'react';
import { VscAdd, VscRemove } from 'react-icons/vsc';
import { useRouter } from 'next/router';

import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './QuantityUpdater.module.scss';

const QuantityUpdater = ({
  originalQuantity,
  onChange,
  quantityAvailable,
  extraStyles,
  showTitle = true,
}) => {
  const [quantity, setQuantity] = useState(originalQuantity);
  const input = useRef(null);
  const { showToast } = useToastContext();
  const { asPath } = useRouter();

  useEffect(() => {
    setQuantity(originalQuantity);
  }, [asPath, originalQuantity]);

  const addOne = () => {
    if (quantity >= quantityAvailable) return;
    onChange(Number(quantity + 1));
    setQuantity((prev) => Number(prev) + 1);
  };

  const removeOne = () => {
    if (quantity > 1) {
      onChange(Number(quantity - 1));
      setQuantity((prev) => Number(prev) - 1);
    }
  };

  const handleChangeInput = (e) => {
    const num = e.target.value;
    if (Number(num) > quantityAvailable) {
      setQuantity(quantityAvailable);
      showToast.error(`There is Only ${quantityAvailable} variant available`);
      return;
    }
    if (Number(num) <= Number(originalQuantity)) setQuantity(num);
  };

  const handleConfirmInput = (e) => {
    if (!e.target.value) setQuantity(Number(originalQuantity));
    else if (quantity !== originalQuantity) onChange(Number(quantity));
  };

  return (
    <div className={`${styles.container} ${extraStyles}`}>
      {showTitle && <b className={styles.label}>SELECT QUANTITY</b>}
      <div className={styles.box}>
        <button type="button" onClick={removeOne} className={styles.button} disabled={quantity <= 1}>
          <VscRemove />
        </button>
        <input
          id="quantity"
          name="quantity"
          type="number"
          ref={input}
          size="4"
          className={styles.input}
          onChange={handleChangeInput}
          onBlur={handleConfirmInput}
          onKeyDown={(e) => e.key === 'Enter' && input.current.blur()}
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
