import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';
import styles from './ProductList.module.scss';

function ProductsList({ products }) {
  return (
    <ul className={styles.container}>
      {Array.isArray(products) &&
        products.map((product) => (
          <ProductCardDefault key={product.id} product={product} />
        ))}
    </ul>
  );
}

export default ProductsList;
