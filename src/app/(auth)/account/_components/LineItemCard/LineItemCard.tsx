import Image from 'next/image';

import type { LineItem } from '@/shopify/admin';
import type { MoneyV2 } from '@/shopify/storefront';
import type { Image as ImageType } from '@/shopify/storefront';

import styles from './LineItemCard.module.scss';

const LineItemCard = ({ item }: { item: LineItem }) => {
  const { quantity, title, variant } = item;
  const { title: variantTitle = '', selectedOptions = [] } = variant || {};

  const price = variant?.price as MoneyV2;
  const image = variant?.image as unknown as ImageType & {
    small: string;
  };
  const altText = image?.altText || variantTitle;

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        {typeof image?.small === 'string' && (
          <Image src={image?.small} alt={altText} quality={20} height={150} width={150} />
        )}
      </div>
      <div className={styles.details}>
        <p>Quantity: {quantity}</p>
        <p>Title: {title}</p>
        <p>
          Price: {price?.amount} {price?.currencyCode}
        </p>
        {selectedOptions?.map((option, index) => (
          <p key={option.name + index}>
            {option.name}: {option.value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LineItemCard;
