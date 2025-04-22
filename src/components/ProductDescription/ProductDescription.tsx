'use client';

import type { GetProductByHandleQuery } from '@/shopify/storefront';

import { bag, heart } from '@/assets/svg';
import Button from '@/components/Button/Button';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useProductSelection from '@/hooks/useProductSelection';

import Options from '../Options/Options';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

import styles from './ProductDescription.module.scss';

const ProductDescription = ({
  product,
  isModal,
}: {
  product: GetProductByHandleQuery['product'];
  isModal?: boolean;
}) => {
  const {
    handleAddToCart,
    selectedVariant,
    handleChangeInput,
    totalPrice,
    handleSetSelectedProductOption,
    quantity,
    isOptionOutOfStock,
    isOptionSelected,
  } = useProductSelection({ product });
  const { productType, options, title, id } = product || {};

  const { userWishlist, handleSetWishlist } = useUserContext();
  const isWishlisted = userWishlist?.find((item) => item.id === id);

  const {
    quantityAvailable,
    availableForSale,
    price,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
  } = selectedVariant || {};

  const handleWishlist = async () => {
    await handleSetWishlist(!!isWishlisted, product);
  };

  return (
    <>
      <PhotoGallery images={selectedVariant?.image as unknown as ImageFields} alt={title} />
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
            onClick={handleSetSelectedProductOption}
            isOptionSelected={isOptionSelected}
            isOptionOutOfStock={isOptionOutOfStock}
          />
          <QuantityUpdater
            showTitle
            originalQuantity={1}
            onChange={handleChangeInput}
            quantityAvailable={quantityAvailable}
            maxQuantity={quantityAvailable}
          />
        </div>
        <div className={styles.wrapper}>
          <div className={styles['unit-price']}>
            <small>Unit price</small>
            <p>
              {price?.currencyCode} {price?.amount}
            </p>
          </div>
          <div className={styles['total-price']}>
            <small>Total price</small>
            <p>
              {price?.currencyCode} {totalPrice}
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
            onClick={() => {
              handleWishlist().catch((error) => console.error(error));
            }}
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
