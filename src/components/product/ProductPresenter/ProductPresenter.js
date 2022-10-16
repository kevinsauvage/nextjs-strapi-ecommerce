import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import useProductSelection from '@/hooks/useProductSelection';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({ product, isModal }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  console.log(product);
  return (
    <div className={styles.container}>
      <PhotoGallery
        items={product.variants}
        images={product.images}
        selectedVariant={selectedVariant}
      />
      <ProductDescription
        product={product}
        isOptionOutOfStock={isOptionOutOfStock}
        handleChangeInput={handleChangeInput}
        handleAddToCart={handleAddToCart}
        handleSetSelectedProductOption={handleSetSelectedProductOption}
        selected={selectedVariant}
        isOptionSelected={isOptionSelected}
        isModal={isModal}
      />
    </div>
  );
}
