import Button from '@/components/Button/Button';
import QuantityUpdater from '@/components/scopes/product/QuantityUpdater/QuantityUpdater';
import styles from './ProductDescription.module.scss';
import Options from '../Options/Options';

export default function ProductDescription({
  handleSetSelectedProductOption,
  isOptionOutOfStock,
  handleChangeInput,
  isOptionSelected,
  handleAddToCart,
  selected,
  product,
  totalPrice,
}) {
  const { productType, variants, options, title } = product || {};

  const { quantityAvailable, availableForSale, priceV2 } = selected || {};

  return (
    <div className={styles.ProductDescription}>
      <span className={styles.type}>{productType}</span>
      <h1 className={styles.title}>{title}</h1>
      <Options
        options={options}
        isOptionOutOfStock={isOptionOutOfStock}
        isSelected={isOptionSelected}
        handleClick={handleSetSelectedProductOption}
        variants={variants}
      />
      <div className={styles.wrapper}>
        <QuantityUpdater
          originalQuantity={1}
          onChange={handleChangeInput}
          quantityAvailable={quantityAvailable}
        />
        <div>
          <p className={styles.totalPriceTitle}>
            <strong>TOTAL PRICE</strong>
          </p>
          <p className={styles.totalPrice}>
            <strong>
              {totalPrice} {priceV2?.currencyCode}
            </strong>
          </p>
        </div>
      </div>
      <Button
        extraClass={styles.btn}
        type="button"
        text={availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
        tertiary={availableForSale}
        primary={!availableForSale}
        disabled={!availableForSale}
        onClick={handleAddToCart}
      />
    </div>
  );
}
