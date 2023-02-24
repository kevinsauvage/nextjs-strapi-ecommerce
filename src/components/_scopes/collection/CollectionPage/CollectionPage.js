import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import Loader from '@/components/_loaders/Loader/Loader';

function CollectionPage() {
  const { loading, products, layout, handleNext, pageInfo } = useCollectionContext();

  return (
    <ProductsList
      handleNext={handleNext}
      hasNextPage={pageInfo?.hasNextPage}
      products={products}
      layout={layout}
      loading={loading}
      loader={<Loader />}
    />
  );
}

export default CollectionPage;
