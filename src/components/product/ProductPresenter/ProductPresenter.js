import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { toast } from 'react-toastify';
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

  const addOne = () => {
    if (quantity >= selectedVariant.quantityAvailable) {
      return setQuantity(selectedVariant.quantityAvailable);
    }
    return setQuantity((prev) => prev + 1);
  };

  const removeOne = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChangeInput = (e) => {
    const num = e.target.value;
    if (num > selectedVariant.quantityAvailable) {
      return toast.error(
        `There is Only ${selectedVariant.quantityAvailable} variant available`
      );
    }
    console.log(num);
    return setQuantity(num);
  };

  const handleBlurInput = (e) => {
    if (!e.target.value) setQuantity(1);
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
        handleBlurInput={handleBlurInput}
      />
    </div>
  );
}
