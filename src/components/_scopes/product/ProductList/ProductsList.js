import ListDisplay from '@/components/ListDisplay/ListDisplay';
import dynamic from 'next/dynamic';
import notFound from '@/assets/Notfound.svg';
import Image from 'next/image';
import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

function ProductsList({ products, loading, layout, loader, hasNextPage, handleNext }) {
  const getProductCardRow = (product) => {
    const ProductCardRow = dynamic(() => import('../ProductCardRow/ProductCardRow'), {
      loading: () => loader,
    });
    return <ProductCardRow product={product} key={product.id} />;
  };

  return (
    <Container size="medium">
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
      {loading ? (
        <BlockLoader />
      ) : (
        Array.isArray(products) &&
        products.length === 0 &&
        !loading && (
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
        )
      )}

      {Array.isArray(products) && products.length > 0 && handleNext && (
        <div className={styles.nextButton}>
          <Button primary disabled={!hasNextPage} onClick={() => handleNext()}>
            Next
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ProductsList;
