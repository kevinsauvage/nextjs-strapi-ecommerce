import Image from 'next/image';
import Link from 'next/link';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useRef } from 'react';
import styles from './ProductCardDefault.module.scss';
import Price from '../Price/Price';

export default function ProductCardDefault({ product = {} }) {
  const { title, images, handle, variants, productType, collections } = product;
  const { priceV2, compareAtPriceV2 } = variants?.[0] || {};

  const { setSelectedProduct } = useGlobalContext() || {};
  const cardRef = useRef();

  const isWhatPercentOf = (x, y) => (((x - y) / y) * 100.0).toFixed(0);

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link
        ref={cardRef}
        href={`${config.routes.collection}/${collections?.[0]?.handle}/${handle}`}
        aria-label={`View product details for ${title}`}
      >
        <div className={styles.image}>
          <Image
            src={images?.[0]?.large}
            alt={images?.[0]?.alt || title}
            width={800}
            height={800}
            blurDataURL={images?.[0]?.blurDataURL}
            placeholder="blur"
            quality={20}
            aria-label={`Image of ${title}`}
          />
          <div
            className={styles.quickView}
            role="button"
            tabIndex="0"
            aria-label="Quick view"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSelectedProduct(product);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSelectedProduct(product);
            }}
          >
            <div className={styles.quickViewInner}>
              <p>Quick view</p>
            </div>
          </div>
        </div>
        {compareAtPriceV2 && priceV2?.amount !== compareAtPriceV2?.amount && (
          <div className={styles.discount}>
            <p>{isWhatPercentOf(priceV2?.amount, compareAtPriceV2?.amount)}%</p>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.productType}>{productType}</div>
            <b className={styles.title}>{title}</b>
            <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="S" />
          </div>
        </div>
      </Link>
    </li>
  );
}
