import Image from 'next/image';
import Link from 'next/link';
import config from '@/config/index';
import Button from '@/components/Button/Button';
import styles from './CartItem.module.scss';
import { Row, TData } from '../../table/Table/Table';

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
  const totalPrice = Number(variant?.priceV2?.amount) * Number(quantity);

  return (
    <Row>
      <TData>
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
              <h6 className={styles.title}>{title}</h6>
            </Link>
            <p className={styles.variant}>{variant.title}</p>
          </li>
        </ul>
      </TData>
      <TData>
        <span className={styles.price}>€{variant.priceV2.amount}</span>
      </TData>
      <TData>
        <input
          type="number"
          size="4"
          id={inputId}
          defaultValue={quantity}
          className={styles.input}
          onChange={(e) =>
            handleChange({
              id: lineId,
              quantity: parseInt(e.target.value, 10),
            })
          }
        />
      </TData>
      <TData>
        <span className={styles.subtotal}>€{totalPrice.toFixed(2)}</span>
      </TData>
      <TData>
        <Button
          contrast
          className={styles.button}
          onClick={() => removeFromCart(lineId)}
        >
          Remove
        </Button>
      </TData>
    </Row>
  );
}
