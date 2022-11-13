import useProductSelection from '@/hooks/useProductSelection';
import PhotoGallery from '@/components/product/PhotoGallery/PhotoGallery';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({
  product,
  isModal,
  carousel,
  gallery,
}) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  return (
    <div className={`${styles.container}  ${isModal ? styles.modal : ''}`}>
      <PhotoGallery
        items={product.variants}
        images={product.images}
        selectedVariant={selectedVariant}
        version="Gallery"
        carousel={carousel}
        gallery={gallery}
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
