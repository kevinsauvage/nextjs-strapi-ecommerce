import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import useCartContext from '@/contexts/CartContext/useCartContext';
import styles from './ProductPresenter.module.scss';
import ProductDescription from '../ProductDescription/ProductDescription';

export default function ProductPresenter({ product, isModal }) {
  const { addToCart } = useCartContext();

  const [selectedVariant, setSelectedVariant] = useState();

  useEffect(() => {
    if (product) setSelectedVariant(product?.variants?.[0]);
  }, [product]);

  const [quantity, setQuantity] = useState(1);

  const handleSelect = (e) => {
    const id = e.target.value;
    const selected = product.variants.find((variant) => variant.id === id);
    setSelectedVariant(selected);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(selectedVariant.id, quantity, JSON.stringify(product));
    }
  };

  const handleChangeInput = (num) => setQuantity(num);

  return (
    <div className={styles.container}>
      <PhotoGallery
        items={product.variants}
        selectedVariant={selectedVariant}
        handleSelect={(item) => setSelectedVariant(item)}
      />
      <ProductDescription
        product={product}
        quantity={quantity}
        handleSelect={handleSelect}
        handleChangeInput={handleChangeInput}
        handleAddToCart={handleAddToCart}
        selected={selectedVariant}
        isModal={isModal}
      />
    </div>
  );
}
