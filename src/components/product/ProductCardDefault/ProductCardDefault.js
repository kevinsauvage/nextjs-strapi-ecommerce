import Image from 'next/image';
import Link from 'next/link';
import limitStrLength from '@/utils/limitStringLength';
import useProductContext from '@/contexts/ProductContext/useProductContext';
import config from '@/config/index';
import styles from './ProductCardDefault.module.scss';
import Price from '../Price/Price';

export default function ProductCardDefault({ product = {} }) {
  const { title, images, handle, variants } = product;
  const { priceV2, compareAtPriceV2 } = variants?.[0] || {};
  const { setSelectedProduct } = useProductContext();

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link
        href={`${config.routes.collection}/${product?.collections?.[0]?.handle}/${handle}`}
      >
        <a>
          <div className={styles.image}>
            <Image
              src={images?.[0]?.s}
              alt={images?.[0]?.alt}
              layout="responsive"
              width={500}
              height={750}
              blurDataURL={images?.[0]?.blurDataURL}
              placeholder="blur"
              quality={70}
              loading="lazy"
            />
            <div
              className={styles.quickView}
              role="button"
              tabIndex="0"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedProduct(product);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedProduct(product);
              }}
            >
              Quick view
            </div>
          </div>
          <div className={styles.content}>
            <p className={styles.title}>{limitStrLength(title, 40)}</p>
            <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} />
          </div>
        </a>
      </Link>
    </li>
  );
}
