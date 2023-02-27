import ListDisplay from '@/components/ListDisplay/ListDisplay';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import styles from './ProductList.module.scss';
import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';
import ProductCardRow from '../ProductCardRow/ProductCardRow';

function ProductsList({ products, layout, hasNextPage, handleNext }) {
  return (
    <Container size="medium">
      {Array.isArray(products) && products.length > 0 && (
        <ListDisplay layout={layout}>
          {products.map((product) =>
            layout === 'grid' ? (
              <ProductCardDefault product={product} key={product.id} />
            ) : (
              <ProductCardRow product={product} key={product.id} />
            )
          )}
        </ListDisplay>
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
