import Button from '@/components/Button/Button';
import QuantityUpdater from '@/components/_scopes/product/QuantityUpdater/QuantityUpdater';
import Image from 'next/image';
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
  quantity,
}) {
  const { productType, variants, options, title } = product || {};

  const {
    quantityAvailable,
    availableForSale,
    priceV2,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
  } = selected || {};

  return (
    <div className={styles.ProductDescription}>
      <h1 className={styles.title}>{title}</h1>
      <ul className={styles.list}>
        <li>
          <b>Sku: </b>
          <small>{sku}</small>
        </li>
        {productType && (
          <li>
            <b>Product type: </b>
            <small>{productType}</small>
          </li>
        )}
        <li>
          <b>Available: </b>
          <small>{quantityAvailable || 0}</small>
        </li>
        <li>
          <b>Selected variant: </b>
          <small>{variantTitle}</small>
        </li>
        <li>
          <b>Unit price: </b>
          <small>{`${priceV2?.amount} ${priceV2?.currencyCode}`}</small>
        </li>
        {weight && (
          <li>
            <b>Weight: </b>
            <small>{`${weight} ${weightUnit?.toLowerCase()}`}</small>
          </li>
        )}
      </ul>

      <ul className={styles.variantList}>
        {product?.variants.map((variant) => {
          const { image } = variant;
          return (
            <button
              type="button"
              key={variant.id}
              className={`${styles.variantButton} ${
                selected?.image?.src === image?.src ? styles.selectedVariant : ''
              } `}
              onClick={() => handleSetSelectedProductOption(variant.selectedOptions)}
            >
              <Image src={image.small} width={image.width} height={image.height} alt="variant image" />
            </button>
          );
        })}
      </ul>

      <Options
        options={options}
        isOptionOutOfStock={isOptionOutOfStock}
        isSelected={isOptionSelected}
        handleClick={handleSetSelectedProductOption}
        variants={variants}
      />
      <div className={styles.wrapper}>
        <QuantityUpdater
          showTitle={false}
          originalQuantity={1}
          onChange={handleChangeInput}
          quantityAvailable={quantityAvailable}
        />
        <Button
          extraClass={styles.btn}
          type="button"
          primary
          disabled={!availableForSale || quantityAvailable < quantity}
          onClick={handleAddToCart}
        >
          {availableForSale ? `ADD TO CART (${priceV2?.currencyCode} ${totalPrice})` : 'SOLD OUT'}
        </Button>
      </div>
    </div>
  );
}
