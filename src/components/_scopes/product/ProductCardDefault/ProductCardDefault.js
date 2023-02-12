import Image from 'next/image';
import Link from 'next/link';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import styles from './ProductCardDefault.module.scss';
import Price from '../Price/Price';

export default function ProductCardDefault({ product = {} }) {
  const { title, images, handle, variants, collections, productType, priceRange } = product;

  console.log('🚀 ~ file: ProductCardDefault.js:12 ~ ProductCardDefault ~ priceRange', priceRange);

  const { priceV2, compareAtPriceV2 } = variants?.[0] || {};
  const { query } = useRouter();

  const { setSelectedProduct } = useGlobalContext() || {};
  const cardRef = useRef();

  const isWhatPercentOf = (x, y) => (((x - y) / y) * 100.0).toFixed(0);

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link
        ref={cardRef}
        className={styles.link}
        href={`/${productType}/${query?.collectionSlug || collections?.[0]?.handle}/${handle}`}
        aria-label={`View product details for ${title}`}
      >
        <div className={styles.image}>
          <Image
            src={images?.[0]?.medium}
            alt={images?.[0]?.alt || title}
            width={800}
            height={800}
            blurDataURL={images?.[0]?.blurDataURL}
            placeholder="blur"
            quality={20}
            aria-label={`Image of ${title}`}
          />
        </div>
        {compareAtPriceV2 && priceV2?.amount !== compareAtPriceV2?.amount && (
          <div className={styles.discount}>
            <p>{isWhatPercentOf(priceV2?.amount, compareAtPriceV2?.amount)}%</p>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.contentInner}>
            <b className={styles.title}>{title}</b>
            <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="S" />
            <button
              className={styles.quickView}
              type="button"
              aria-label="Quick view"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedProduct(product);
              }}
            >
              Quick view
            </button>
          </div>
        </div>
      </Link>
    </li>
  );
}
