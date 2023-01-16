import { useEffect } from 'react';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

function CollectionPage({ collection: { products: initialProducts }, pageInfo: initialPageInfo, filters }) {
  const { loading, setPageInfo, setProducts, products, setAllFilters, layout } = useCollectionContext();

  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
    if (initialPageInfo) setPageInfo(initialPageInfo);
    if (filters) setAllFilters(filters);
  }, [filters, initialPageInfo, initialProducts, setAllFilters, setPageInfo, setProducts]);

  return <ProductsList products={products} layout={layout} loading={loading} />;
}

export default CollectionPage;
