import styles from './Price.module.scss';

const Price = ({ compareAtPriceV2, priceV2, size = 'M' }) => {
  const isDiscount = compareAtPriceV2 && compareAtPriceV2?.amount !== priceV2?.amount;

  const sizeStyles = {
    S: styles.small,
    M: styles.medium,
    L: styles.large,
  };

  return (
    <div className={`${styles.price} ${sizeStyles[size]}`}>
      {isDiscount && (
        <p className={styles.compare}>
          {compareAtPriceV2?.amount} {compareAtPriceV2?.currencyCode}
        </p>
      )}
      <p className={styles.current}>
        <span>{priceV2?.amount}</span>
        <span> {priceV2?.currencyCode}</span>
      </p>
    </div>
  );
};

export default Price;
