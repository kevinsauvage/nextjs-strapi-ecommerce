import useProductSelection from '@/hooks/useProductSelection';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';
import ProductDetails from '../ProductDetails/ProductDetails';
import PhotoGalleryWithCarousel from '../PhotoGalleryWithCarousel/PhotoGalleryWithCarousel';

export default function ProductPresenter({ product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
    totalPrice,
    quantity,
  } = useProductSelection({ product });
  const { descriptionHtml } = product || {};

  return (
    <>
      <div className={styles.container}>
        <PhotoGalleryWithCarousel images={product?.images} />
        <ProductDescription
          product={product}
          quantity={quantity}
          isOptionOutOfStock={isOptionOutOfStock}
          handleChangeInput={handleChangeInput}
          handleAddToCart={handleAddToCart}
          handleSetSelectedProductOption={handleSetSelectedProductOption}
          selected={selectedVariant}
          isOptionSelected={isOptionSelected}
          isModal={false}
          totalPrice={totalPrice}
        />
      </div>
      <ProductDetails html={descriptionHtml} />
    </>
  );
}
