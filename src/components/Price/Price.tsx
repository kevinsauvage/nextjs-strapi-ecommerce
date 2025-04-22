import type { MoneyV2 } from '@/shopify/storefront';

import styles from './Price.module.scss';

const Price = ({
  compareAtPrice,
  price,
  size = 'M',
}: {
  compareAtPrice: MoneyV2 | null;
  price: MoneyV2 | null;
  size?: 'S' | 'M' | 'L';
}) => {
  const isDiscount = compareAtPrice && compareAtPrice?.amount !== price?.amount;

  const sizeStyles = {
    L: styles.large,
    M: styles.medium,
    S: styles.small,
  };

  return (
    <div className={`${styles.price} ${sizeStyles[size]}`}>
      {isDiscount && (
        <p className={styles.compare}>
          {compareAtPrice?.amount} {compareAtPrice?.currencyCode}
        </p>
      )}
      <p className={styles.current}>
        <span>{price?.amount}</span>
        <span> {price?.currencyCode}</span>
      </p>
    </div>
  );
};

export default Price;
