import Image from 'next/legacy/image';
import QuantityUpdater from '@/components/_scopes/product/QuantityUpdater/QuantityUpdater';
import Link from 'next/link';
import SelectedOptions from '@/components/_scopes/product/SelectedOptions/SelectedOptions';
import config from '@/config/index';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import Price from '../Price/Price';
import styles from './ProductCheckoutCard.module.scss';

export default function ProductCheckoutCard({ lineItem }) {
  const { handleQuantityChange, removeFromCheckout } = useCheckoutContext();

  const { variant, quantity, id, title } = lineItem || {};

  const { image, compareAtPriceV2, priceV2, product, quantityAvailable, selectedOptions } = variant || {};

  const collection = product?.collections?.nodes?.[0];

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={image?.small}
          layout="fill"
          objectFit="cover"
          blurDataURL={image?.blurDataURL}
          placeholder="blur"
          alt={image?.alt}
        />
      </div>
      <div className={styles.body}>
        <Link href={`${config.routes.collection}/${collection?.handle}/${product?.handle}`}>
          <h5 className={styles.title}>{title}</h5>
        </Link>
        <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="M" />
        <SelectedOptions options={selectedOptions} />
        <div className={styles.bottom}>
          <QuantityUpdater
            showTitle={false}
            originalQuantity={quantity}
            quantityAvailable={quantityAvailable}
            onChange={(num) => handleQuantityChange([{ id, quantity: parseInt(num, 10) }])}
          />
          <button className={styles.remove} type="button" onClick={() => removeFromCheckout(id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
