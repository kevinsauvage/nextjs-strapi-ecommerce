import { useEffect } from 'react';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

function CollectionPage({ collection, pageInfo: initialPageInfo, filters }) {
  const { loading, setPageInfo, setProducts, products, setAllFilters, layout } = useCollectionContext();

  useEffect(() => {
    if (collection.products) setProducts(collection.products);
    if (initialPageInfo) setPageInfo(initialPageInfo);
    if (filters) setAllFilters(filters);
  }, [collection, filters, initialPageInfo, setAllFilters, setPageInfo, setProducts]);

  return <ProductsList products={products} layout={layout} loading={loading} />;
}

export default CollectionPage;
