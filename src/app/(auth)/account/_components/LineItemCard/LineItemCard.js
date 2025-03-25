import Image from 'next/image';

import styles from './LineItemCard.module.scss';

const LineItemCard = ({ item }) => {
  const { quantity, title, variant } = item;
  const { title: variantTitle, selectedOptions, image, priceV2 } = variant || {};

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Image
          src={image?.small}
          alt={image?.alt || variantTitle}
          quality={20}
          height={150}
          width={150}
        />
      </div>
      <div className={styles.details}>
        <p>Quantity: {quantity}</p>
        <p>Title: {title}</p>
        <p>
          Price: {priceV2?.amount} {priceV2?.currencyCode}
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
