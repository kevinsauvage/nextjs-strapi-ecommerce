import Image from 'next/image';
import Link from 'next/link';
import limitStrLength from '@/utils/limitStringLength';
import routes from '@/data/routes';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './ProductCardDefault.module.scss';

export default function ProductCardDefault({ product }) {
  const { title, images, handle } = product;

  const price = product?.variants?.[0]?.priceV2?.amount;
  const currencyCode = product?.variants?.[0]?.priceV2?.currencyCode;

  const { setSelectedModalProduct } = useGlobalContext();

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link href={`${routes.base.product}/${handle}`}>
        <a>
          <div className={styles.image}>
            <Image
              src={images?.[0]?.sm}
              alt={images?.[0]?.alt}
              layout="responsive"
              objectFit="cover"
              width="300"
              height="400"
              blurDataURL={images?.[0]?.blurDataURL}
              placeholder="blur"
            />
            <div
              className={styles.quickView}
              role="button"
              tabIndex="0"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedModalProduct(product);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedModalProduct(product);
              }}
            >
              Quick view
            </div>
          </div>

          <div className={styles.content}>
            <p className={styles.title}>{limitStrLength(title, 40)}</p>
            <p className={styles.price}>
              <strong>
                {price}
                {currencyCode}
              </strong>
            </p>
          </div>
        </a>
      </Link>
    </li>
  );
}
