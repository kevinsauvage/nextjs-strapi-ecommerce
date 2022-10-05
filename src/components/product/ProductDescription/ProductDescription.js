import Button from '@/components/Button/Button';
import routes from '@/data/routes';
import Link from 'next/link';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import styles from './ProductDescription.module.scss';
import Option from '../Option/Option';

export default function ProductDescription({
  product,
  selected,
  handleAddToCart,
  handleChangeInput,
  handleSetSelectedProductOption,
  isOptionSelected,
  isModal,
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

      {Array.isArray(options) &&
        options.length > 1 &&
        options.map((option) => (
          <Option
            key={option.id}
            option={option}
            isSelected={isOptionSelected}
            handleClick={(value, name) => {
              handleSetSelectedProductOption({
                name,
                value,
              });
            }}
          />
        ))}

      {isModal && (
        <Link
          href={`${routes.collection}/${product?.collections?.[0]?.handle}/${product.handle}`}
        >
          <a className={styles.fullDescription}>See Full Description</a>
        </Link>
      )}
      <p>{quantityAvailable} Available</p>

      {quantityAvailable > 0 ? (
        <div className={styles.row}>
          <QuantityUpdater
            originalQuantity={1}
            onChange={handleChangeInput}
            quantityAvailable={quantityAvailable}
          />
          <Button
            extraClass={styles.btn}
            type="button"
            text="ADD TO CART"
            tertiary
            disabled={quantityAvailable < 1}
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
