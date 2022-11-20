import Image from 'next/image';
import QuantityUpdater from '@/components/product/QuantityUpdater/QuantityUpdater';
import Link from 'next/link';
import SelectedOptions from '@/components/product/SelectedOptions/SelectedOptions';
import config from '@/config/index';
import Price from '../Price/Price';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({
  product,
  variant,
  quantity,
  onQuantityChange,
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
          width="500"
          height="750"
          blurDataURL={image?.blurDataURL}
          placeholder="blur"
          alt={image?.alt}
        />
      </div>
      <div className={styles.body}>
        <Link
          href={`${config.routes.collection}/${product.collections?.[0].handle}/${product.handle}`}
        >
          <a>
            <h6 className={styles.title}>{product?.title}</h6>
          </a>
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
