import Image from 'next/image';
import Link from 'next/link';
import config from '@/config/index';
import { close } from '@/assets/svg';
import styles from './CartItem.module.scss';

export default function CartItem({
  product,
  variant,
  inputId,
  quantity,
  handleChange,
  removeFromCart,
  collection,
  lineId,
  title,
}) {
  const handleUpdate = (newQuantity) => {
    let q;
    if (newQuantity < 0) {
      q = 0;
    } else q = newQuantity;

    return handleChange({
      id: lineId,
      quantity: parseInt(q, 10),
    });
  };

  const totalPrice = Number(variant?.priceV2?.amount) * Number(quantity);

  return (
    <tr className={styles.container}>
      <td className={styles.item}>
        <ul className={styles.list}>
          <li className={styles.image}>
            <Image
              src={variant.image.small}
              alt={variant.image.alt || variant.title}
              width={variant.image.width}
              height={variant.image.height}
            />
          </li>
          <li className={styles.content}>
            <Link
              className={styles.link}
              href={`${config.routes.collection}/${collection?.handle}/${product?.handle}`}
            >
              <h5 className={styles.title}>{title}</h5>
            </Link>
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
          defaultValue={quantity}
          onChange={(e) => handleUpdate(e.target.value)}
          className={styles.input}
        />
      </td>
      <td className={styles.item}>
        <span className={styles.subtotal}>€{totalPrice.toFixed(2)}</span>
      </td>
      <td className={styles.item}>
        <div
          role="button"
          tabIndex="0"
          className={styles.delete}
          onKeyDown={(e) => e.key === 'Enter' && removeFromCart(lineId)}
          onClick={() => removeFromCart(lineId)}
        >
          {close}
        </div>
      </td>
    </tr>
  );
}
