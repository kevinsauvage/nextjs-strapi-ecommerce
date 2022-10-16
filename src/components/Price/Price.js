import styles from './Price.module.scss';

export default function Price({ compareAtPriceV2, priceV2 }) {
  const isDiscount = compareAtPriceV2?.amount > priceV2?.amount;
  return (
    <div
      className={`${`${styles.Price} ${
        isDiscount ? styles.PriceDiscount : ''
      }`}`}
    >
      <p className={styles.currentPrice}>
        {priceV2?.amount}
        {priceV2?.currencyCode}
      </p>
      {isDiscount && (
        <p className={styles.compareAtPriceV2}>
          {compareAtPriceV2.amount}
          {compareAtPriceV2.currencyCode}
        </p>
      )}
    </div>
  );
}
