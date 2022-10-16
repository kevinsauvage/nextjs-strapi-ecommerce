import Button from '@/components/Button/Button';
import routes from '@/data/routes';
import Link from 'next/link';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import Price from '@/components/Price/Price';
import Collapsible from '@/layout/Collapsible/Collapsible';
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
  const { title, descriptionHtml, options, collections, handle, variants } =
    product || {};
  const { quantityAvailable, priceV2, compareAtPriceV2 } = selected || {};

  const href = `${routes.collection}/${collections?.[0]?.handle}/${handle}`;

  return (
    <div
      className={
        `${styles.ProductDescription} ` +
        `${isModal ? styles.ProductDescriptionModal : ''}`
      }
    >
      {isModal ? (
        <Link href={href}>
          <a>
            <h4 className={styles.title}>{title}</h4>
          </a>
        </Link>
      ) : (
        <h4 className={styles.title}>{title}</h4>
      )}
      <Price compareAtPriceV2={compareAtPriceV2} priceV2={priceV2} />
      <Separator />
      <Options
        options={options}
        isOptionOutOfStock={isOptionOutOfStock}
        isSelected={isOptionSelected}
        handleClick={handleSetSelectedProductOption}
        variants={variants}
      />

      {isModal ? (
        <Button
          extraClass={styles.btnSeeProduct}
          type="button"
          text="SEE PRODUCT"
          primary
          href={href}
        />
      ) : (
        <Collapsible title="Description">
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </Collapsible>
      )}

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
