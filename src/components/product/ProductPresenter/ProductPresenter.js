import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useProductContext from '@/contexts/ProductContext/useProductContext';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({ product, isModal }) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartContext();
  const { setSelectedVariant, selectedVariant, setSelectedProductOption } =
    useProductContext();

  useEffect(() => {
    if (product?.handle) {
      setSelectedVariant(product.handle);
    }
  }, [product, setSelectedVariant]);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(selectedVariant.id, quantity, JSON.stringify(product));
    }
  };

  useEffect(() => {
    const optionsSelected = [];
    product?.options.forEach((option) => {
      optionsSelected.push({ name: option.name, value: option.values[0] });
    });
    setSelectedProductOption(product?.handle, optionsSelected);
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
