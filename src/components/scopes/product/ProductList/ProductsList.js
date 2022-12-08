import ListDisplay from '@/layout/ListDisplay/ListDisplay';
import PageLoader from '@/layout/Loader/PageLoader/PageLoader';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';
import ProductCardRow from '../ProductCardRow/ProductCardRow';

function ProductsList({ products, loading, layout }) {
  return (
    <>
      {loading ? <PageLoader /> : ''}

      {Array.isArray(products) && products.length > 0 ? (
        <ListDisplay layout={layout}>
          {products.map((product) => {
            if (layout === 'grid')
              return <ProductCardDefault key={product.id} product={product} />;
            return <ProductCardRow key={product.id} product={product} />;
          })}
        </ListDisplay>
      ) : (
        ''
      )}

      {Array.isArray(products) && products.length === 0 && !loading ? (
        <div className={styles.noResults}>No results</div>
      ) : (
        ''
      )}
    </>
  );
}

export default ProductsList;
