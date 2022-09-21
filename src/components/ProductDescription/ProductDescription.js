import { VscAdd, VscRemove } from 'react-icons/vsc';
import Button from '@/components/Button/Button';
import styles from './ProductDescription.module.scss';

export default function ProductDescription({
  product,
  selected,
  handleSelect,
  handleAddToCart,
  addOne,
  removeOne,
  quantity,
  handleChangeInput,
}) {
  const { title, availableForSale, descriptionHtml, variants, tags } = product;

  return (
    <div className={styles.ProductDescription}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.price}>
          {selected?.priceV2?.amount} {selected?.priceV2?.currencyCode}
        </p>
      </div>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />

      {tags && Array.isArray(tags) && tags.length && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {variants && Array.isArray(variants) && variants.length && (
        <select onChange={handleSelect} className={styles.select}>
          {variants.map((variant) => (
            <option value={variant.id} key={variant.id}>
              {variant.title}
            </option>
          ))}
        </select>
      )}

      <div className={styles.row}>
        <div className={styles.quantityContainer}>
          <button type="button" onClick={addOne} className={styles.btnQuantity}>
            <VscAdd />
          </button>

          <input
            type="number"
            size="4"
            value={quantity}
            className={styles.input}
            onChange={handleChangeInput}
          />

          <button
            type="button"
            onClick={removeOne}
            className={styles.btnQuantity}
          >
            <VscRemove />
          </button>
        </div>
        <Button
          extraClass={styles.btn}
          type="button"
          text={availableForSale ? 'ADD TO CART' : 'NOT AVAILABLE'}
          tertiary
          disabled={!availableForSale}
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
}
