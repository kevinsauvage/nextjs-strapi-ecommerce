import { useContext, useState } from 'react';
import { CartContext } from '@/contexts/CartContext/CartContext';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import ProductDescription from '@/components/ProductDescription/ProductDescription';
import styles from './ProductPresenter.module.scss';

export default function ProductPresenter({ product }) {
  const { addToCart } = useContext(CartContext);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );
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
        removeOne={removeOne}
      />
    </div>
  );
}
