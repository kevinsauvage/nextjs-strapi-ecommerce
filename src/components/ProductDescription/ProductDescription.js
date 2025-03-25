'use client';

import { bag, heart } from '@/assets/svg';
import Button from '@/components/Button/Button';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useProductSelection from '@/hooks/useProductSelection';
import { isOptionOutOfStock, isOptionSelected } from '@/utils/products';

import Options from '../Options/Options';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

import styles from './ProductDescription.module.scss';

const ProductDescription = ({ product, isModal }) => {
  const {
    handleSetSelectedProductOption,
    selectedProductOption,
    handleAddToCart,
    selectedVariant,
    handleChangeInput,
    totalPrice,
    quantity,
  } = useProductSelection({ product });
  const { productType, options, title, variants, id } = product || {};

  const { userWishlist, handleSetWishlist } = useUserContext();
  const isWishlisted = userWishlist?.find((item) => item.id === id);

  const {
    quantityAvailable,
    availableForSale,
    priceV2,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
  } = selectedVariant || {};

  const handleWishlist = async () => {
    await handleSetWishlist(isWishlisted, product);
  };

  return (
    <>
      <PhotoGallery images={selectedVariant.image} />
      <div className={styles.description}>
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
            isOptionOutOfStock={(name, value) =>
              isOptionOutOfStock(name, value, variants, selectedProductOption)
            }
            isSelected={(name, value) => isOptionSelected(name, value, selectedProductOption)}
            handleClick={handleSetSelectedProductOption}
          />
          <QuantityUpdater
            showTitle
            originalQuantity={1}
            onChange={handleChangeInput}
            quantityAvailable={quantityAvailable}
          />
        </div>
        <div className={styles.wrapper}>
          <div className={styles['unit-price']}>
            <small>Unit price</small>
            <p>
              {priceV2?.currencyCode} {priceV2?.amount}
            </p>
          </div>
          <div className={styles['total-price']}>
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
            extraClass={`${styles.button} ${isWishlisted && styles.active}`}
          >
            {heart} {isWishlisted ? 'Remove from' : 'Add to'} wishlist
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDescription;
