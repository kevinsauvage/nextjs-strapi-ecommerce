import { useRef, useState } from 'react';
import { VscAdd, VscRemove } from 'react-icons/vsc';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import styles from './QuantityUpdater.module.scss';

export default function QuantityUpdater({
  originalQuantity,
  onChange,
  quantityAvailable,
  extraStyles,
  showTitle = true,
}) {
  const [quantity, setQuantity] = useState(originalQuantity);
  const input = useRef(null);
  const { showToast } = useToastContext();

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
      return showToast.error(`There is Only ${quantityAvailable} variant available`);
    }
    if (Number(num) <= Number(originalQuantity)) return setQuantity(num);
    return false;
  };

  const handleConfirmInput = (e) => {
    if (!e.target.value) setQuantity(Number(originalQuantity));
    else if (quantity !== originalQuantity) onChange(Number(quantity));
  };

  return (
    <div className={`${styles.quantityContainer} ${extraStyles}`}>
      {showTitle && <b className={styles.label}>SELECT QUANTITY</b>}
      <div className={styles.inputBox}>
        <button type="button" onClick={removeOne} className={styles.btnQuantity} disabled={quantity <= 1}>
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
          className={styles.btnQuantity}
          disabled={quantity >= quantityAvailable}
        >
          <VscAdd />
        </button>
      </div>
    </div>
  );
}
