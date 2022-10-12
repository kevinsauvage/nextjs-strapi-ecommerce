import styles from './Price.module.scss';

export default function Price({ compareAtPriceV2, priceV2 }) {
  return (
    <div className={styles.Price}>
      <p className={styles.currentPrice}>
        {priceV2?.amount}
        {priceV2?.currencyCode}
      </p>
      {compareAtPriceV2?.amount > priceV2?.amount && (
        <p className={styles.compareAtPriceV2}>
          {compareAtPriceV2.amount}
          {compareAtPriceV2.currencyCode}
        </p>
      )}
    </div>
  );
}
