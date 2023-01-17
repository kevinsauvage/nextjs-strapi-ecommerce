import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

function CollectionPage() {
  const { loading, products, layout } = useCollectionContext();
  return <ProductsList products={products} layout={layout} loading={loading} />;
}

export default CollectionPage;
