import type { ProductFieldsFragment } from '@/shopify/storefront';

import BlockLoader from '@/components/_loaders/BlockLoader/BlockLoader';
import ListDisplay from '@/components/ListDisplay/ListDisplay';

import ProductCardDefault from '../ProductCardDefault/ProductCardDefault';

import styles from './ProductEdgeList.module.scss';

const ProductEdgeList = ({
  products,
  layout = 'grid',
  loading,
}: {
  products: { node: ProductFieldsFragment; cursor: string }[];
  layout?: 'grid' | 'list';
  loading?: boolean;
}) =>
  Array.isArray(products) && (
    <div className={styles.list}>
      <ListDisplay layout={layout}>
        {products.map((product, index) => (
          <ProductCardDefault product={product.node} key={product.cursor} priority={index < 5} />
        ))}
      </ListDisplay>
      {loading && <BlockLoader />}
    </div>
  );

export default ProductEdgeList;
