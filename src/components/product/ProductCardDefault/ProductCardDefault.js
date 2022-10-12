import Image from 'next/image';
import Link from 'next/link';
import limitStrLength from '@/utils/limitStringLength';
import routes from '@/data/routes';
import useProductContext from '@/contexts/ProductContext/useProductContext';
import Price from '@/components/Price/Price';
import styles from './ProductCardDefault.module.scss';

export default function ProductCardDefault({ product }) {
  const { title, images, handle } = product;
  const priceV2 = product?.variants?.[0]?.priceV2;
  const compareAtPriceV2 = product?.variants?.[0]?.compareAtPriceV2;

  const { setSelectedProduct } = useProductContext();

  return (
    <li className={`${styles.productCardDefault}`}>
      <Link
        href={`${routes.collection}/${product?.collections?.[0]?.handle}/${handle}`}
      >
        <a>
          <div className={styles.image}>
            <Image
              src={images?.[0]?.sm}
              alt={images?.[0]?.alt}
              layout="responsive"
              objectFit="cover"
              width="500"
              height="750"
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
