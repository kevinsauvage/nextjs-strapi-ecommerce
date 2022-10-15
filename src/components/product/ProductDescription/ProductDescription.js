import Button from '@/components/Button/Button';
import routes from '@/data/routes';
import Link from 'next/link';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import styles from './ProductDescription.module.scss';
import Options from '../Options/Options';

export default function ProductDescription({
  product,
  selected,
  handleAddToCart,
  handleChangeInput,
  handleSetSelectedProductOption,
  isOptionSelected,
  isModal,
  isOptionOutOfStock,
}) {
  const { title, descriptionHtml, options } = product || {};
  const { quantityAvailable } = selected || {};

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
      <div className={styles.descriptionWrapper}>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
        {isModal && (
          <div className={styles.fullDescription}>
            <Link
              href={`${routes.collection}/${product?.collections?.[0]?.handle}/${product.handle}`}
            >
              <a>See Full Description</a>
            </Link>
          </div>
        )}
      </div>

      {/*       {tags && Array.isArray(tags) && tags.length && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )} */}

      <Options
        styles={styles.options}
        options={options}
        isOptionOutOfStock={isOptionOutOfStock}
        isSelected={isOptionSelected}
        handleClick={handleSetSelectedProductOption}
      />

      <QuantityUpdater
        extraStyles={styles.quantityUpdater}
        originalQuantity={1}
        onChange={handleChangeInput}
        quantityAvailable={quantityAvailable}
      />
      {quantityAvailable > 0 ? (
        <Button
          extraClass={styles.btn}
          type="button"
          text="ADD TO CART"
          tertiary
          disabled={quantityAvailable < 1}
          onClick={handleAddToCart}
        />
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
