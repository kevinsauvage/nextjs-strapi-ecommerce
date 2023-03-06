import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import Button from '@/components/Button/Button';
import ListDisplay from '@/components/ListDisplay/ListDisplay';
import NoResults from '@/components/NoResults/NoResults';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

import styles from './ProductList.module.scss';

function ProductsList({ products, layout = 'grid', hasNextPage, handleNext, loading }) {
  return (
    <div>
      {Array.isArray(products) && products.length > 0 ? (
        <ListDisplay layout={layout}>
          {products.map((product, i) => (
            <ProductCardDefault product={product} key={product.id} priority={i < 5} />
          ))}
        </ListDisplay>
      ) : (
        !loading && <NoResults />
      )}

      {loading && <BlockLoader />}

      {Array.isArray(products) && products.length > 0 && handleNext && (
        <div className={styles.nextButton}>
          <Button contrast disabled={!hasNextPage} onClick={() => handleNext()}>
            Load more products
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
