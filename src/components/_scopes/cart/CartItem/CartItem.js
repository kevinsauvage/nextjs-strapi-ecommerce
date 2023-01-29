import Image from 'next/image';
import Link from 'next/link';
import config from '@/config/index';
import styles from './CartItem.module.scss';
import { Row, TData } from '../../table/Table/Table';
import QuantityUpdater from '../../product/QuantityUpdater/QuantityUpdater';

export default function CartItem({
  product,
  variant,
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
        <div className={styles.list}>
          <div className={styles.image}>
            <Image
              src={variant.image.small}
              alt={variant.image.alt || variant.title}
              width={600}
              height={600}
            />
          </div>
          <div className={styles.content}>
            <Link
              className={styles.link}
              href={`${config.routes.collection}/${collection?.handle}/${product?.handle}`}
            >
              <b className={styles.title}>{title}</b>
            </Link>
            <p className={styles.variant}>{variant.title}</p>
          </div>
        </div>
      </TData>
      <TData>
        <span className={styles.price}>€{variant.priceV2.amount}</span>
      </TData>
      <TData>
        <QuantityUpdater
          showTitle={false}
          originalQuantity={quantity}
          onChange={(newQuantity) =>
            handleChange({
              id: lineId,
              quantity: newQuantity,
            })
          }
        />
      </TData>
      <TData>
        <span className={styles.subtotal}>€{totalPrice.toFixed(2)}</span>
      </TData>
      <TData>
        <button type="button" className={styles.button} onClick={() => removeFromCart(lineId)}>
          Remove
        </button>
      </TData>
    </Row>
  );
}
