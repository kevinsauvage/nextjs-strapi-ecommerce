import type { ProductFieldsFragment } from '@/shopify/storefront';

import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import ListDisplay from '@/components/ListDisplay/ListDisplay';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

import styles from './ProductList.module.scss';

const ProductsList = ({
  products,
  layout = 'grid',
  loading,
}: {
  products: ProductFieldsFragment[];
  layout?: 'grid' | 'list';
  loading?: boolean;
}) => {
  const hasProducts = Array.isArray(products) && products.length > 0;
  return (
    hasProducts && (
      <div className={styles.list}>
        <ListDisplay layout={layout}>
          {products.map((product, index) => (
            <ProductCardDefault product={product} key={product.id} priority={index < 5} />
          ))}
        </ListDisplay>
        {loading && <BlockLoader />}
      </div>
    )
  );
};

export default ProductsList;
