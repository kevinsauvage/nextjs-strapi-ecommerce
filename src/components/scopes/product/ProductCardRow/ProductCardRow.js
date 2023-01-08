import Image from 'next/image';
import Link from 'next/link';
import limitStrLength from '@/utils/limitStringLength';
import useProductSelection from '@/hooks/useProductSelection';
import QuantityUpdater from '@/components/scopes/product/QuantityUpdater/QuantityUpdater';
import Button from '@/components/Button/Button';
import config from '@/config/index';
import Price from '../Price/Price';
import styles from './ProductCardRow.module.scss';
import Options from '../Options/Options';

export default function ProductCardRow({ product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  const { title, handle, options } = product;

  const { quantityAvailable, image, compareAtPriceV2, priceV2 } =
    selectedVariant || {};

  console.log(image);
  return (
    <li className={`${styles.ProductCardRow}`}>
      <div className={styles.image}>
        {image?.small && (
          <Image
            src={image?.medium}
            alt={selectedVariant?.title}
            fill
            blurDataURL={image?.blurDataURL}
            placeholder="blur"
          />
        )}
      </div>

      <div className={styles.content}>
        <div>
          <Link
            href={`${config.routes.collection}/${product?.collections?.[0]?.handle}/${handle}`}
          >
            <h4 className={styles.title}>{limitStrLength(title, 90)}</h4>
          </Link>
          <Price
            priceV2={priceV2}
            compareAtPriceV2={compareAtPriceV2}
            size="L"
          />

          <Options
            styles={styles.options}
            options={options}
            isOptionOutOfStock={isOptionOutOfStock}
            isSelected={isOptionSelected}
            handleClick={handleSetSelectedProductOption}
          />
          <QuantityUpdater
            originalQuantity={1}
            onChange={handleChangeInput}
            quantityAvailable={quantityAvailable}
          />
        </div>

        <footer className={styles.footer}>
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
}
