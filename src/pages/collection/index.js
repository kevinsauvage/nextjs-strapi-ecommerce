import Page from '@/layout/Page/Page';
import Carousel, { CarouselItem } from '@/components/Carousel/Carousel';
import { getCollectionsWithProducts } from '@/lib/shopify/collection/collectionApiCall';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      {Array.isArray(collections) &&
        collections.map(
          (collection) =>
            collection.products.length > 0 && (
              <Carousel key={collection.id} title={collection.title}>
                {Array.isArray(collection.products) &&
                  collection.products.map((product) => (
                    <CarouselItem key={product.id}>
                      <ProductCardDefault product={product} />
                    </CarouselItem>
                  ))}
              </Carousel>
            )
        )}
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  const collections = await getCollectionsWithProducts(5);

  return {
    props: {
      collections,
    },
    revalidate: 60, // In seconds
  };
}
