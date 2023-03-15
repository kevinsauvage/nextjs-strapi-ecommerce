import Image from 'next/image';
import Link from 'next/link';

import QuantityUpdater from '@/components/_scopes/product/QuantityUpdater/QuantityUpdater';
import Button from '@/components/Button/Button';
import useProductSelection from '@/hooks/useProductSelection';

import Options from '../Options/Options';
import Price from '../Price/Price';

import styles from './ProductCardRow.module.scss';

const ProductCardRow = ({ product }) => {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  const { title, handle, options, collections, productType } = product;
  const { quantityAvailable, image, compareAtPriceV2, priceV2 } = selectedVariant || {};

  return (
    <li className={`${styles.card}`}>
      <div className={styles.image}>
        {image?.small && (
          <Image
            src={image?.medium}
            alt={selectedVariant?.title}
            width={800}
            height={800}
            blurDataURL={image?.blurDataURL}
            placeholder="blur"
          />
        )}
      </div>
      <div className={styles.content}>
        <div>
          <Link href={`/${productType}/${collections?.[0]?.handle}/${handle}`}>
            <b className={styles.title}>{title}</b>
          </Link>
          <Price priceV2={priceV2} compareAtPriceV2={compareAtPriceV2} size="M" />
          <Options
            styles={styles.options}
            options={options}
            isOptionOutOfStock={isOptionOutOfStock}
            isSelected={isOptionSelected}
            handleClick={handleSetSelectedProductOption}
            size="M"
          />
        </div>
        <footer className={styles.footer}>
          <QuantityUpdater
            originalQuantity={1}
            onChange={handleChangeInput}
            quantityAvailable={quantityAvailable}
            showTitle={false}
          />
          {quantityAvailable > 0 ? (
            <Button
              extraClass={styles.btn}
              type="button"
              text="ADD TO CART"
              primary
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
        </footer>
      </div>
    </li>
  );
};

export default ProductCardRow;
