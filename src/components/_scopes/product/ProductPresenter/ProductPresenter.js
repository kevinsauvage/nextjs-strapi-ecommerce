import Container from '@/components/Container/Container';
import useProductSelection from '@/hooks/useProductSelection';

import PhotoSlider from '../PhotoSlider/PhotoSlider';
import ProductDescription from '../ProductDescription/ProductDescription';
import ProductDetails from '../ProductDetails/ProductDetails';
import ProductReviews from '../ProductReview/ProductReviews';

import styles from './ProductPresenter.module.scss';

export default function ProductPresenter({ product, isModal }) {
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
        <PhotoSlider selectedVariant={selectedVariant} variants={product?.variants} />
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

      {!isModal && (
        <Container size="medium">
          <ProductDetails html={descriptionHtml} />
          <ProductReviews product={product} />
        </Container>
      )}
    </>
  );
}
