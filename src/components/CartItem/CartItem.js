import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { CartContext } from '@/contexts/CartContext/CartContext';
import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import { toast } from 'react-toastify';
import styles from './CartItem.module.scss';

export default function CartItem({ product, inputId }) {
  const { removeFromCart, handleQuantityChange } = useContext(CartContext);
  const { quantity, variant } = product;

  const [newQuantity, setNewQuantity] = useState(quantity);

  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);

  const handleUpdate = () => {
    if (quantity < 1 || !quantity)
      return toast.error('Quantity must be higher than zero');

    return handleQuantityChange(newQuantity, product.id);
  };

  const totalPrice = Number(variant.priceV2.amount) * Number(quantity);

  return (
    <tr className={styles.container}>
      <td className={styles.item}>
        <ul className={styles.list}>
          <li className={styles.image}>
            <Link href={`${routes.base.shop}/${variant?.product?.handle}`}>
              <a>
                <Image
                  src={variant.image.src}
                  width={variant.image.width}
                  height={variant.image.height}
                  alt="Electronic equipment"
                  layout="responsive"
                />
              </a>
            </Link>
          </li>
          <li className={styles.content}>
            <p className={styles.title}>{product.title}</p>
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
          onKeyDown={(e) => e.key === 'Enter' && removeFromCart(product.id)}
          onClick={() => removeFromCart(product.id)}
        >
          <MdOutlineDeleteForever />
        </div>
      </td>
    </tr>
  );
}
