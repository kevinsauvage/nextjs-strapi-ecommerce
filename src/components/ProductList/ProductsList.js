import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import ListDisplay from '@/components/ListDisplay/ListDisplay';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

import styles from './ProductList.module.scss';

const ProductsList = ({ products, layout = 'grid', loading }) =>
  Array.isArray(products) && (
    <div className={styles.list}>
      <ListDisplay layout={layout}>
        {products.map((product, index) => (
          <ProductCardDefault product={product} key={product.id + index} priority={index < 5} />
        ))}
      </ListDisplay>
      {loading && <BlockLoader />}
    </div>
  );

export default ProductsList;
