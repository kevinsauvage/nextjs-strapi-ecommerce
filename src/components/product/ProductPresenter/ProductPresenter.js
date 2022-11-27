import useProductSelection from '@/hooks/useProductSelection';
import PhotoGallery from '@/components/product/PhotoGallery/PhotoGallery';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({ product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  return (
    <div className={styles.container}>
      <PhotoGallery images={product.images} />
      <ProductDescription
        product={product}
        isOptionOutOfStock={isOptionOutOfStock}
        handleChangeInput={handleChangeInput}
        handleAddToCart={handleAddToCart}
        handleSetSelectedProductOption={handleSetSelectedProductOption}
        selected={selectedVariant}
        isOptionSelected={isOptionSelected}
        isModal={false}
      />
    </div>
  );
}
