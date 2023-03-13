import { useEffect, useState } from 'react';

import PhotoSlider from '@/components/_scopes/product/PhotoSlider/PhotoSlider';
import ProductDescription from '@/components/_scopes/product/ProductDescription/ProductDescription';
import useProductSelection from '@/hooks/useProductSelection';
import getClient from '@/shopify/index';

import Modal from '../Modal/Modal';

import styles from './ModalProduct.module.scss';

export default function ModalProduct({ handleClose, selectedProduct }) {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { handle } = selectedProduct || {};
    if (handle) {
      // TODO: handle error here
      getClient()
        .storefront.product.getProductByHandle({ handle })
        .then((res) => {
          if (res?.handle) setProduct(res);
          setLoading(false);
        });
    }
  }, [selectedProduct]);

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

  return (
    <Modal loading={loading} handleClose={handleClose}>
      <div className={styles.modalProduct}>
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
          isModal
          totalPrice={totalPrice}
        />
      </div>
    </Modal>
  );
}
