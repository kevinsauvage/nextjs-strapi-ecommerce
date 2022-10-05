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
    quantity,
  } = useProductSelection({ product });

  return (
    <div className={styles.container}>
      <PhotoGallery
        items={product.variants}
        selectedVariant={selectedVariant}
      />
      <ProductDescription
        product={product}
        quantity={quantity}
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
