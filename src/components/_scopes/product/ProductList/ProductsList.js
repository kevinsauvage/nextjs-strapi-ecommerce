import ListDisplay from '@/components/ListDisplay/ListDisplay';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import dynamic from 'next/dynamic';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

function ProductsList({ products, loading, layout, loader }) {
  const getProductCardRow = (product) => {
    const ProductCardRow = dynamic(() => import('../ProductCardRow/ProductCardRow'), {
      loading: () => loader,
    });
    return <ProductCardRow product={product} key={product.id} />;
  };

  return (
    <>
      {loading && <PageLoader />}
      {Array.isArray(products) && products.length > 0 && (
        <ListDisplay layout={layout}>
          {products.map((product) =>
            layout === 'grid' ? (
              <ProductCardDefault product={product} key={product.id} />
            ) : (
              getProductCardRow(product)
            )
          )}
        </ListDisplay>
      )}
      {Array.isArray(products) && products.length === 0 && !loading && (
        <div className={styles.noResults}>No results</div>
      )}
    </>
  );
}

export default ProductsList;
