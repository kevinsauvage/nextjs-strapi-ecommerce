import { useState } from 'react';

import { bag, heart } from '@/assets/svg';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import QuantityUpdater from '@/components/_scopes/product/QuantityUpdater/QuantityUpdater';
import Button from '@/components/Button/Button';
import useUserContext from '@/contexts/UserContext/useUserContext';

import Options from '../Options/Options';

import styles from './ProductDescription.module.scss';

export default function ProductDescription({
  handleSetSelectedProductOption,
  isOptionOutOfStock,
  handleChangeInput,
  isOptionSelected,
  handleAddToCart,
  selected,
  product,
  isModal,
  totalPrice,
  quantity,
}) {
  const { productType, variants, options, title } = product || {};

  const { handleSetProductToWishList, isWishlist } = useUserContext();

  const [loading, setLoading] = useState(false);

  const handleWishlist = async () => {
    setLoading(true);
    await handleSetProductToWishList(product);
    setLoading(false);
  };

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
      {loading && <PageLoader />}
      <h1 className={styles.title}>{title}</h1>
      {!isModal && (
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

          {weight && (
            <li>
              <b>Weight: </b>
              <small>{`${weight} ${weightUnit?.toLowerCase()}`}</small>
            </li>
          )}
        </ul>
      )}
      <div className={styles.options}>
        <Options
          options={options}
          isOptionOutOfStock={isOptionOutOfStock}
          isSelected={isOptionSelected}
          handleClick={handleSetSelectedProductOption}
          variants={variants}
        />
        <QuantityUpdater
          showTitle
          originalQuantity={1}
          onChange={handleChangeInput}
          quantityAvailable={quantityAvailable}
        />
      </div>
      <div className={`${styles.wrapper} ${styles.prices}`}>
        <div className={styles.unitPrice}>
          <small>Unit price</small>
          <p>
            {priceV2?.currencyCode} {priceV2?.amount}
          </p>
        </div>
        <div className={styles.totalPrice}>
          <small>Total price</small>
          <p>
            {priceV2?.currencyCode} {totalPrice}
          </p>
        </div>
      </div>
      <div className={styles.wrapper}>
        <Button
          type="button"
          extraClass={styles.button}
          primary
          disabled={!availableForSale || quantityAvailable < quantity}
          onClick={handleAddToCart}
        >
          {bag} {availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
        </Button>
        <Button
          type="button"
          contrast
          onClick={() => handleWishlist()}
          extraClass={`${styles.button} ${isWishlist(product) && styles.isWishlist}`}
        >
          {heart} {isWishlist(product) ? 'Remove from' : 'Add to'} wishlist
        </Button>
      </div>
    </div>
  );
}
