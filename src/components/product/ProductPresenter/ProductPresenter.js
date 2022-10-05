import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useProductContext from '@/contexts/ProductContext/useProductContext';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({ product, isModal }) {
  const [quantity, setQuantity] = useState(1);
  // const [selectedProductOption, setSelectedProductOption] = useState();

  const { addToCart } = useCartContext();
  const {
    setSelectedVariant,
    selectedVariant,
    setSelectedProductOption,
    selectedProductOption,
  } = useProductContext();

  console.log('product', product);

  useEffect(() => {
    if (product.id) setSelectedVariant(product.variants[0]);
  }, [product, setSelectedVariant]);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(selectedVariant.id, quantity, JSON.stringify(product));
    }
  };
  const getDifference = (array1, array2) => {
    const difference = array1.filter(
      (object1) =>
        !array2.some(
          (object2) =>
            object1.name === object2.name && object1.value === object2.value
        )
    );

    if (difference.length) return true;
    return false;
  };

  useEffect(() => {
    if (product?.id && selectedProductOption?.length) {
      const dif = product.variants.filter(
        (variant) =>
          !getDifference(variant.selectedOptions, selectedProductOption),
        {}
      );
      setSelectedVariant(...dif);
    }
  }, [selectedProductOption, product, setSelectedVariant]);

  useEffect(() => {
    const optionsSelected = [];
    product?.options.forEach((option) => {
      optionsSelected.push({ name: option.name, value: option.values[0] });
    });
    setSelectedProductOption(optionsSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleChangeInput = (num) => setQuantity(num);

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
        selected={selectedVariant}
        isModal={isModal}
      />
    </div>
  );
}
