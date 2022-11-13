import { ClipLoader } from 'react-spinners';
import ListDisplay from '@/layout/ListDisplay/ListDisplay';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';
import ProductCardRow from '../ProductCardRow/ProductCardRow';

function ProductsList({ products, loading, layout }) {
  return (
    <>
      {Array.isArray(products) && products.length > 0 && !loading && (
        <ListDisplay layout={layout}>
          {products.map((product) => {
            if (layout === 'grid')
              return <ProductCardDefault key={product.id} product={product} />;
            return <ProductCardRow key={product.id} product={product} />;
          })}
        </ListDisplay>
      )}

      {Array.isArray(products) && products.length === 0 && !loading && (
        <div className={styles.noResults}>No results</div>
      )}

      {loading && (
        <div className={styles.loader}>
          <ClipLoader loading={loading} />
        </div>
      )}
    </>
  );
}

export default ProductsList;
