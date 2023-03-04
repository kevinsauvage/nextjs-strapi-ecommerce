import Image from 'next/image';

import styles from './LineItemCard.module.scss';

function LineItemCard({ item }) {
  const { quantity, title, variant } = item;
  const { title: variantTitle, selectedOptions, image, priceV2 } = variant || {};

  return (
    <div className={styles.LineItemCard}>
      <div className={styles.image}>
        <Image src={image?.small} alt={image?.alt || variantTitle} quality={20} height={150} width={150} />
      </div>
      <div className={styles.details}>
        <p>Quantity: {quantity}</p>
        <p>Title: {title}</p>
        <p>
          Price: {priceV2?.amount} {priceV2?.currencyCode}
        </p>
        {selectedOptions &&
          selectedOptions?.map((option) => (
            <p key={option.name}>
              {option.name}: {option.value}
            </p>
          ))}
      </div>
    </div>
  );
}

export default LineItemCard;
