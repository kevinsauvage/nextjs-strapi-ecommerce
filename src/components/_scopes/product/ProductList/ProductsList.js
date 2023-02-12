import ListDisplay from '@/components/ListDisplay/ListDisplay';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import dynamic from 'next/dynamic';
import notFound from '@/assets/Notfound.svg';
import Image from 'next/image';
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
        <div className={styles.noResults}>
          <Image
            alt="No products were found."
            src={notFound.src}
            width={notFound.width}
            height={notFound.height}
          />
          <b>Result Not Found</b>
          <p>Whoops... No products were found.</p>
        </div>
      )}
    </>
  );
}

export default ProductsList;
