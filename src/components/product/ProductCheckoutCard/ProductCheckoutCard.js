import Image from 'next/image';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import routes from '@/data/routes';
import Link from 'next/link';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({
  product,
  variant,
  quantity,
  onQuantityChange,
  remove,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={variant?.image?.sm}
          layout="responsive"
          objectFit="cover"
          width="500"
          height="750"
          blurDataURL={variant?.image?.blurDataURL}
          placeholder="blur"
          alt={variant?.image?.alt}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <Link
            href={`${routes.collection}/${product.collections?.[0].handle}/${product.handle}`}
          >
            <a>
              <p className={styles.title}>{product?.title}</p>
            </a>
          </Link>
        </div>
        <div className={styles.row}>
          <p className={styles.variantTitle}>{variant?.title}</p>
        </div>
        <p className={styles.price}>
          <strong>Price:</strong> {Number(variant?.priceV2?.amount)}{' '}
          {variant?.priceV2?.currencyCode}
        </p>
        <p className={styles.price}>
          <strong>Total:</strong>{' '}
          {(Number(variant?.priceV2?.amount) * quantity).toFixed(2)}{' '}
          {variant?.priceV2?.currencyCode}
        </p>
        <div className={styles.bottom}>
          <QuantityUpdater
            originalQuantity={quantity}
            quantityAvailable={variant?.quantityAvailable}
            onChange={onQuantityChange}
          />
          <button className={styles.remove} type="button" onClick={remove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
