import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import Button from '@/components/Button/Button';
import Link from 'next/link';
import styles from './collectionUi.module.scss';

function CollectionUi({ title, link, products, buttonText, itemShown = 8 }) {
  return (
    <div className={styles.collectionUi}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h5 className={styles.title}>{title}</h5>
        </div>
        {link && (
          <Link href={link} className={styles.viewAll}>
            View all
          </Link>
        )}
      </div>
      {Array.isArray(products) && products.length > 0 && (
        <ul className={styles.containerGrid}>
          {products.slice(0, itemShown).map((product) => (
            <ProductCardDefault key={product.id} product={product} />
          ))}
        </ul>
      )}
      <div className={styles.button}>
        {link && <Button text={buttonText} href={link} tertiary />}
      </div>
    </div>
  );
}

export default CollectionUi;
