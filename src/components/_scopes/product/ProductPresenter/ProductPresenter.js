import useProductSelection from '@/hooks/useProductSelection';
import PhotoGallery from '@/components/_scopes/product/PhotoGallery/PhotoGallery';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';
import ProductDetails from '../ProductDetails/ProductDetails';

export default function ProductPresenter({ product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
    totalPrice,
  } = useProductSelection({ product });

  const { descriptionHtml } = product || {};
  return (
    <>
      <div className={styles.container}>
        <PhotoGallery images={product.images} alt={product.title} />
        <ProductDescription
          product={product}
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
