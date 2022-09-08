import Image from 'next/image';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={product?.variant.image.src}
          layout="fill"
          width={product?.variant.image.width}
          height={product?.variant.image.height}
          objectFit="cover"
        />
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <p className={styles.title}>{product?.title}</p>
          <p className={styles.quantity}>
            <span>X</span>
            {product?.quantity}
          </p>
        </div>
        <div className={styles.row}>
          <p className={styles.description}>{product?.variant.title}</p>
        </div>
      </div>
    </div>
  );
}
