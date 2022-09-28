import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import ProductDescription from '@/components/ProductDescription/ProductDescription';
import useCartContext from '@/contexts/CartContext/useCartContext';
import styles from './ProductPresenter.module.scss';

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
      addToCart(selectedVariant.id, quantity);
    }
  };

  const addOne = () => {
    setQuantity((prev) => prev + 1);
  };
  const removeOne = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChangeInput = (e) => {
    const num = Number(e.target.value);
    if (num < 1) return;
    setQuantity(e.target.value);
  };

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
        addOne={addOne}
        isModal={isModal}
        removeOne={removeOne}
      />
    </div>
  );
}
