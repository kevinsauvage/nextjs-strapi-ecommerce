import Container from '@/layout/Container/Container';
import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getCollectionsWithProducts } from '@/lib/shopify/collection/collectionApiCall';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      <div>
        <Container>
          {Array.isArray(collections) &&
            collections.map(
              (collection) =>
                collection.products.length > 0 && (
                  <Carousel key={collection.id} title={collection.title}>
                    {Array.isArray(collection.products) &&
                      collection.products.map((product) => (
                        <ProductCardDefault
                          key={product.id}
                          product={product}
                        />
                      ))}
                  </Carousel>
                )
            )}
        </Container>
      </div>
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
