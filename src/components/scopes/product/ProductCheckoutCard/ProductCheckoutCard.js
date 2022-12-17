import Image from 'next/legacy/image';
import QuantityUpdater from '@/components/scopes/product/QuantityUpdater/QuantityUpdater';
import Link from 'next/link';
import SelectedOptions from '@/components/scopes/product/SelectedOptions/SelectedOptions';
import config from '@/config/index';
import Price from '../Price/Price';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({
  collection,
  product,
  variant,
  quantity,
  onQuantityChange,
  title,
  remove,
}) {
  const {
    image,
    compareAtPriceV2,
    priceV2,
    quantityAvailable,
    selectedOptions,
  } = variant || {};

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={image?.sm}
          layout="fill"
          objectFit="cover"
          blurDataURL={image?.blurDataURL}
          placeholder="blur"
          alt={image?.alt}
        />
      </div>
      <div className={styles.body}>
        <Link
          href={`${config.routes.collection}/${collection?.handle}/${product?.handle}`}
        >
          <h6 className={styles.title}>{title}</h6>
        </Link>
        <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="S" />
        <SelectedOptions options={selectedOptions} />
        <div className={styles.bottom}>
          <QuantityUpdater
            originalQuantity={quantity}
            quantityAvailable={quantityAvailable}
            onChange={onQuantityChange}
          />
          <button className={styles.remove} type="button" onClick={remove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
