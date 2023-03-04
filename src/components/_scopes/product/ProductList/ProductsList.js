import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import Button from '@/components/Button/Button';
import ListDisplay from '@/components/ListDisplay/ListDisplay';
import NoResults from '@/components/NoResults/NoResults';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';
import ProductCardRow from '../ProductCardRow/ProductCardRow';

import styles from './ProductList.module.scss';

function ProductsList({ products, layout = 'grid', hasNextPage, handleNext, loading }) {
  return (
    <div>
      {Array.isArray(products) && products.length > 0 ? (
        <ListDisplay layout={layout}>
          {products.map((product) =>
            layout === 'grid' ? (
              <ProductCardDefault product={product} key={product.id} />
            ) : (
              <ProductCardRow product={product} key={product.id} />
            )
          )}
        </ListDisplay>
      ) : (
        !loading && <NoResults />
      )}

      {loading && <BlockLoader />}

      {Array.isArray(products) && products.length > 0 && handleNext && (
        <div className={styles.nextButton}>
          <Button primary disabled={!hasNextPage} onClick={() => handleNext()}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
