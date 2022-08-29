import Image from 'next/image';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({ item }) {
  const { product, quantity } = item;
  console.log(item);
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={product.image.src}
          layout="fill"
          width={product.image.width}
          height={product.image.height}
          objectFit="cover"
        />
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <p className={styles.title}>{product.title}</p>
          <p className={styles.quantity}>
            <span>X</span>
            {quantity}
          </p>
        </div>
        <div className={styles.row}>
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
