import Button from '@/components/Button/Button';
import routes from '@/data/routes';
import Link from 'next/link';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import Price from '@/components/Price/Price';
import Separator from '@/components/Separator/Separator';
import styles from './ProductDescription.module.scss';
import Options from '../Options/Options';

export default function ProductDescription({
  handleSetSelectedProductOption,
  isOptionOutOfStock,
  handleChangeInput,
  isOptionSelected,
  handleAddToCart,
  selected,
  product,
  isModal,
}) {
  const {
    descriptionHtml,
    productType,
    collections,
    variants,
    options,
    handle,
    title,
  } = product || {};

  const { quantityAvailable, priceV2, compareAtPriceV2, availableForSale } =
    selected || {};

  return (
    <div
      className={
        `${styles.ProductDescription} ` +
        `${isModal ? styles.ProductDescriptionModal : ''} `
      }
    >
      <span className={styles.type}>
        <p>{productType}</p>
      </span>
      <h4 className={styles.title}>{title}</h4>
      <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} />
      {!isModal && (
        <>
          <Separator />
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </>
      )}
      <Options
        options={options}
        isOptionOutOfStock={isOptionOutOfStock}
        isSelected={isOptionSelected}
        handleClick={handleSetSelectedProductOption}
        variants={variants}
      />
      <Separator />
      <div className={styles.footer}>
        <QuantityUpdater
          originalQuantity={1}
          onChange={handleChangeInput}
          quantityAvailable={quantityAvailable}
        />
        <Button
          extraClass={styles.btn}
          type="button"
          text={availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
          tertiary={availableForSale}
          primary={!availableForSale}
          disabled={!availableForSale}
          onClick={handleAddToCart}
        />
      </div>
      {isModal && (
        <Link
          href={`${routes.collection}/${collections?.[0]?.handle}/${handle}`}
        >
          <a className={styles.btnSeeProduct}>SEE FULL PRODUCT INFO</a>
        </Link>
      )}
    </div>
  );
}
