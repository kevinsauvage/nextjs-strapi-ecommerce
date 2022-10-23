import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import { toast } from 'react-toastify';
import styles from './CartItem.module.scss';

export default function CartItem({
  product,
  variant,
  inputId,
  quantity,
  handleQuantityChange,
  removeFromCart,
  lineId,
}) {
  const [newQuantity, setNewQuantity] = useState(quantity);

  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);

  const handleUpdate = () => {
    if (quantity < 1 || !quantity)
      return toast.error('Quantity must be higher than zero');

    return handleQuantityChange(newQuantity, lineId);
  };

  const totalPrice = Number(variant?.priceV2?.amount) * Number(quantity);

  return (
    <tr className={styles.container}>
      <td className={styles.item}>
        <ul className={styles.list}>
          <li className={styles.image}>
            <Link
              href={`${routes.collection}/${product?.collections?.[0]?.handle}/${product?.handle}`}
            >
              <a>
                <Image
                  src={variant.image.sm}
                  width="500"
                  height="750"
                  layout="responsive"
                  objectFit="cover"
                />
              </a>
            </Link>
          </li>
          <li className={styles.content}>
            <h4 className={styles.title}>{product.title}</h4>
            <p className={styles.variant}>{variant.title}</p>
          </li>
        </ul>
      </td>
      <td className={styles.item}>
        <span className={styles.price}>€{variant.priceV2.amount}</span>
      </td>
      <td className={styles.item}>
        <input
          type="number"
          size="4"
          id={inputId}
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          className={styles.input}
        />
        {newQuantity !== quantity && newQuantity !== 0 && newQuantity !== '' ? (
          <Button
            text="Update"
            onClick={handleUpdate}
            extraClass={styles.updateBtn}
            tertiary
          />
        ) : null}
      </td>
      <td className={styles.item}>
        <span className={styles.price}>€{totalPrice.toFixed(2)}</span>
      </td>
      <td className={styles.item}>
        <div
          role="button"
          tabIndex="0"
          className={styles.delete}
          onKeyDown={(e) => e.key === 'Enter' && removeFromCart(lineId)}
          onClick={() => removeFromCart(lineId)}
        >
          <MdOutlineDeleteForever />
        </div>
      </td>
    </tr>
  );
}
