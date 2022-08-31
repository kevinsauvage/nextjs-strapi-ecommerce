import { useContext, useState } from 'react';
import styles from './ProductDescription.module.scss';
import { CartContext } from '../../contexts/CartContext/CartContext';
import Button from '../Button/Button';

export default function ProductDescription({ product }) {
  const { addToCart } = useContext(CartContext);
  const [selected, setSelected] = useState(product?.variants?.[0]);

  const { title, availableForSale, descriptionHtml } = product;
  console.log(product);

  const handleSelect = (e) => {
    const id = e.target.value;
    const selectedVariant = product.variants.find(
      (variant) => variant.id === id
    );
    console.log(selectedVariant, 'selected');
    setSelected(selectedVariant);
  };

  return (
    <div className={styles.ProductDescription}>
      <h4 className="">
        {title} - {selected?.priceV2?.currencyCode}
        {selected?.priceV2?.amount}
      </h4>
      <div className="" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />

      <select onChange={handleSelect}>
        {product.variants.map((variant) => (
          <option value={variant.id} key={variant.id}>
            {variant.title}
          </option>
        ))}
      </select>
      {availableForSale && (
        <Button
          type="button"
          text="Add to cart"
          tertiary
          disabled={!availableForSale}
          onClick={() => addToCart(selected, 1)}
        />
      )}

      {!availableForSale && (
        <div className="">
          <div className="" role="alert">
            <span className="">Coming soon...</span>
            <span className="">This article is not available yet.</span>
          </div>
        </div>
      )}
    </div>
  );
}
