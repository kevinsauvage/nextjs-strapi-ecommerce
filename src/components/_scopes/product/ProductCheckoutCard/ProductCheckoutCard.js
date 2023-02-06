import Link from 'next/link';
import Image from 'next/image';
import QuantityUpdater from '@/components/_scopes/product/QuantityUpdater/QuantityUpdater';
import SelectedOptions from '@/components/_scopes/product/SelectedOptions/SelectedOptions';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import config from '@/config/index';
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
        <Image src={image?.src} alt={image?.alt} width={image?.width} height={image?.height} />
      </div>
      <div className={styles.body}>
        <Link href={`${config.routes.collection}/${collection?.handle}/${product?.handle}`}>
          <b className={styles.title}>{title}</b>
        </Link>
        <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} size="M" />
        <SelectedOptions options={selectedOptions} />
        <div className={styles.bottom}>
          <button className={styles.remove} type="button" onClick={() => removeFromCheckout(id)}>
            Remove
          </button>
          <QuantityUpdater
            showTitle={false}
            originalQuantity={quantity}
            quantityAvailable={quantityAvailable}
            onChange={(num) => handleQuantityChange([{ id, quantity: parseInt(num, 10) }])}
          />
        </div>
      </div>
    </div>
  );
}
