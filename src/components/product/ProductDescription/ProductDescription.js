import { VscAdd, VscRemove } from 'react-icons/vsc';
import Button from '@/components/Button/Button';
import routes from '@/data/routes';
import Link from 'next/link';
import styles from './ProductDescription.module.scss';

export default function ProductDescription({
  product,
  selected,
  handleSelect,
  handleAddToCart,
  addOne,
  removeOne,
  handleBlurInput,
  handleChangeInput,
  quantity,
  isModal,
}) {
  const { title, descriptionHtml, variants } = product;

  return (
    <div
      className={
        `${styles.ProductDescription} ` +
        `${isModal ? styles.ProductDescriptionModal : ''}`
      }
    >
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

      {/*       {tags && Array.isArray(tags) && tags.length && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )} */}

      {variants && Array.isArray(variants) && variants.length > 1 && (
        <select onChange={handleSelect} className={styles.select}>
          {variants.map((variant) => (
            <option value={variant.id} key={variant.id}>
              {variant.title}
            </option>
          ))}
        </select>
      )}

      {isModal && (
        <Link
          href={`${routes.collection}/${product?.collections?.[0]?.handle}/${product.handle}`}
        >
          <a className={styles.fullDescription}>See Full Description</a>
        </Link>
      )}
      <p>{selected?.quantityAvailable} Available</p>

      {selected?.quantityAvailable > 0 ? (
        <div className={styles.row}>
          <div className={styles.quantityContainer}>
            <button
              type="button"
              onClick={removeOne}
              className={styles.btnQuantity}
            >
              <VscRemove />
            </button>
            <input
              type="number"
              size="4"
              className={styles.input}
              onChange={handleChangeInput}
              onBlur={handleBlurInput}
              value={quantity}
            />
            <button
              type="button"
              onClick={addOne}
              className={styles.btnQuantity}
            >
              <VscAdd />
            </button>
          </div>
          <Button
            extraClass={styles.btn}
            type="button"
            text="ADD TO CART"
            tertiary
            disabled={selected?.quantityAvailable < 1}
            onClick={handleAddToCart}
          />
        </div>
      ) : (
        <Button
          extraClass={styles.btn}
          type="button"
          text="SOLD OUT"
          primary
          disabled
          onClick={handleAddToCart}
        />
      )}
    </div>
  );
}
