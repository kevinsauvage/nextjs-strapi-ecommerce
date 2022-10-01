import Image from 'next/image';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({ product, variant, quantity }) {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={variant?.image?.sm}
          layout="fill"
          width="300"
          height="300"
          objectPosition="center"
          objectFit="cover"
          alt={variant?.image?.alt}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <p className={styles.title}>{product?.title}</p>
          <p className={styles.quantity}>
            <span>X</span>
            {quantity}
          </p>
        </div>
        <div className={styles.row}>
          <p className={styles.description}>{variant?.title}</p>
        </div>
        <p>
          {(Number(variant?.priceV2?.amount) * quantity).toFixed(2)}
          {variant?.priceV2?.currencyCode}
        </p>
      </div>
    </div>
  );
}
