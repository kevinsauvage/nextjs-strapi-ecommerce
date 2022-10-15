import { useRef, useState } from 'react';
import { VscAdd, VscRemove } from 'react-icons/vsc';
import { toast } from 'react-toastify';

import styles from './QuantityUpdater.module.scss';

export default function QuantityUpdater({
  originalQuantity,
  onChange,
  quantityAvailable,
}) {
  const [quantity, setQuantity] = useState(originalQuantity);
  const input = useRef(null);

  const addOne = () => {
    if (quantity >= quantityAvailable) return setQuantity(1);
    onChange(Number(quantity + 1));
    return setQuantity((prev) => Number(prev) + 1);
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
      return toast.error(
        `There is Only ${quantityAvailable} variant available`
      );
    }
    if (Number(num) !== Number(originalQuantity)) return setQuantity(num);
    return false;
  };

  const handleConfirmInput = (e) => {
    if (!e.target.value) setQuantity(Number(originalQuantity));
    else if (quantity !== originalQuantity) onChange(Number(quantity));
  };

  return (
    <div className={styles.quantityContainer}>
      <button type="button" onClick={removeOne} className={styles.btnQuantity}>
        <VscRemove />
      </button>
      <input
        type="number"
        ref={input}
        size="4"
        className={styles.input}
        onChange={handleChangeInput}
        onBlur={handleConfirmInput}
        onKeyDown={(e) => e.key === 'Enter' && input.current.blur()}
        value={quantity}
      />
      <button type="button" onClick={addOne} className={styles.btnQuantity}>
        <VscAdd />
      </button>
    </div>
  );
}
