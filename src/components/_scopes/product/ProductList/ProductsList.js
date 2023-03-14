import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import Button from '@/components/Button/Button';
import ListDisplay from '@/components/ListDisplay/ListDisplay';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

import styles from './ProductList.module.scss';

const ProductsList = ({ products, layout = 'grid', hasNextPage, handleNext, loading }) => {
  return (
    Array.isArray(products) && (
      <div className={styles.ProductsList}>
        <ListDisplay layout={layout}>
          {products.map((product, i) => (
            <ProductCardDefault product={product} key={product.id} priority={i < 5} />
          ))}
        </ListDisplay>
        {loading && <BlockLoader />}
        {handleNext && !loading && (
          <div className={styles.nextButton}>
            <Button contrast disabled={!hasNextPage} onClick={() => handleNext()}>
              Load more products
            </Button>
          </div>
        )}
      </div>
    )
  );
};

export default ProductsList;
