import Image from 'next/image';
import Link from 'next/link';
import styles from './CartItem.module.scss';
import { Row, TData } from '../../table/Table/Table';
import QuantityUpdater from '../../product/QuantityUpdater/QuantityUpdater';

export default function CartItem({ handleChange, removeFromCart, item }) {
  const { merchandise, quantity, id } = item || {};
  const {
    priceV2,
    product,
    title: variantTitle,
    image,
    quantityAvailable,
    id: merchandiseId,
  } = merchandise || {};
  const { title, handle, collections } = product || {};

  const totalPrice = Number(priceV2?.amount) * Number(quantity);

  return (
    <Row>
      <TData>
        <div className={styles.list}>
          <div className={styles.image}>
            <Image src={image.small} alt={image.alt || variantTitle} width={600} height={600} />
          </div>
          <div className={styles.content}>
            <Link
              className={styles.link}
              href={`/${product?.productType}/${collections?.[0]?.handle}/${handle}`}
            >
              <b className={styles.title}>{title}</b>
            </Link>
            <p className={styles.variant}>{variantTitle}</p>
          </div>
        </div>
      </TData>
      <TData>
        <span className={styles.price}>€{priceV2.amount}</span>
      </TData>
      <TData>
        <QuantityUpdater
          showTitle={false}
          originalQuantity={quantity}
          quantityAvailable={quantityAvailable}
          onChange={(newQuantity) =>
            handleChange({
              id,
              quantity: newQuantity,
            })
          }
        />
      </TData>
      <TData>
        <span className={styles.subtotal}>€{totalPrice.toFixed(2)}</span>
      </TData>
      <TData>
        <button type="button" className={styles.button} onClick={() => removeFromCart(id)}>
          Remove
        </button>
      </TData>
    </Row>
  );
}
