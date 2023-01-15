import styles from './Price.module.scss';

export default function Price({ compareAtPriceV2, priceV2, size = 'M' }) {
  const isDiscount = compareAtPriceV2?.amount !== priceV2?.amount;

  const sizeStyles = {
    S: styles.small,
    M: styles.medium,
    L: styles.large,
  };

  return (
    <div className={`${styles.Price} ${isDiscount ? styles.PriceDiscount : ''} ${sizeStyles[size]}`}>
      {isDiscount && (
        <p className={styles.compareAtPriceV2}>
          {compareAtPriceV2.amount}
          {compareAtPriceV2.currencyCode}
        </p>
      )}
      <p className={styles.currentPrice}>
        {priceV2?.amount}
        {priceV2?.currencyCode}
      </p>
    </div>
  );
}
