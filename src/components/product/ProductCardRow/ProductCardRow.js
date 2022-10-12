import Image from 'next/image';
import Link from 'next/link';
import routes from '@/data/routes';
import limitStrLength from '@/utils/limitStringLength';
import useProductSelection from '@/hooks/useProductSelection';
import QuantityUpdater from '@/components/QuantityUpdater/QuantityUpdater';
import Button from '@/components/Button/Button';
import Price from '@/components/Price/Price';
import styles from './ProductCardRow.module.scss';
import Option from '../Option/Option';

export default function ProductCardRow({ product }) {
  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
  } = useProductSelection({ product });

  const { title, handle, options } = product;

  const { quantityAvailable, image, compareAtPriceV2, priceV2 } =
    selectedVariant || {};

  return (
    <li className={`${styles.ProductCardRow}`}>
      <div className={styles.image}>
        <Image
          src={image?.sm}
          alt={image?.alt}
          layout="responsive"
          objectFit="cover"
          width="500"
          height="750"
          blurDataURL={image?.blurDataURL}
          placeholder="blur"
        />
      </div>

      <div className={styles.content}>
        <div>
          <Link
            href={`${routes.collection}/${product?.collections?.[0]?.handle}/${handle}`}
          >
            <a>
              <p className={styles.title}>{limitStrLength(title, 90)}</p>
            </a>
          </Link>
          <Price priceV2={priceV2} compareAtPriceV2={compareAtPriceV2} />
          <div className={styles.options}>
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
          </div>
        </div>

        <footer className={styles.footer}>
          {quantityAvailable > 0 ? (
            <>
              <div className={styles.quantityUpdater}>
                <QuantityUpdater
                  originalQuantity={1}
                  onChange={handleChangeInput}
                  quantityAvailable={quantityAvailable}
                />
              </div>
              <Button
                extraClass={styles.btn}
                type="button"
                text="ADD TO CART"
                tertiary
                disabled={quantityAvailable < 1}
                onClick={handleAddToCart}
              />
            </>
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
