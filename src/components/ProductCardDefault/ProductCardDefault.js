import Image from 'next/image';
import Link from 'next/link';
import limitStrLength from '../../utils/limitStringLength';
import styles from './ProductCardDefault.module.scss';

export default function ProductCardDefault({ product }) {
  const { title, images, description, handle } = product;
  return (
    <Link href={`/shop/${handle}`}>
      <a>
        <li className={styles.productCardDefault}>
          <div className={styles.image}>
            <Image src={images[0]?.src} layout="fill" objectFit="contain" />
          </div>
          <div className={styles.content}>
            <p className={styles.title}>{title}</p>
            <p className={styles.description}>
              {limitStrLength(description, 100)}
            </p>
          </div>
        </li>
      </a>
    </Link>
  );
}
