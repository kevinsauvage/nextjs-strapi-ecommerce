import Image from 'next/legacy/image';
import Link from 'next/link';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './ProductCardDefault.module.scss';
import Price from '../Price/Price';

export default function ProductCardDefault({ product = {} }) {
  const { title, images, handle, variants, productType } = product;
  const { priceV2, compareAtPriceV2 } = variants?.[0] || {};
  const { setSelectedProduct } = useGlobalContext() || {};

  function isWhatPercentOf(x, y) {
    return (((x - y) / y) * 100.0).toFixed(0);
  }

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link
        href={`${config.routes.collection}/${product?.collections?.[0]?.handle}/${handle}`}
      >
        <div className={styles.image}>
          <Image
            src={images?.[0]?.large}
            alt={images?.[0]?.alt || product?.title}
            layout="responsive"
            width={500}
            height={750}
            blurDataURL={images?.[0]?.blurDataURL}
            placeholder="blur"
            quality={20}
          />
          <div
            className={styles.menu}
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
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
              <p>Quick view</p>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {priceV2.amount !== compareAtPriceV2.amount && (
            <div className={styles.discount}>
              <p>{isWhatPercentOf(priceV2.amount, compareAtPriceV2.amount)}%</p>
            </div>
          )}
          <div className={styles.productType}>{productType}</div>
          <h6 className={styles.title}>{title}</h6>
          <Price
            compareAtPriceV2={compareAtPriceV2}
            priceV2={priceV2}
            size="S"
          />
        </div>
      </Link>
    </li>
  );
}
