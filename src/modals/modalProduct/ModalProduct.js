import PhotoGalleryWithCarousel from '@/components/scopes/product/PhotoGalleryWithCarousel/PhotoGalleryWithCarousel';
import useProductSelection from '@/hooks/useProductSelection';
import Modal from '@/layout/Modal/Modal';
import ProductDescription from '@/components/scopes/product/ProductDescription/ProductDescription';
import style from './modalProduct.module.scss';

export default function ModalProduct({ handleClose, product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  return (
    <Modal handleClose={handleClose}>
      <div className={style.modal}>
        <PhotoGalleryWithCarousel
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
          isModal
        />
      </div>
    </Modal>
  );
}
