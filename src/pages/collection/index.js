import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import { getCollections } from '@/lib/shopify/collections';
import Carousel from '@/components/Carousel/Carousel';
import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      <div>
        <Container>
          {Array.isArray(collections) &&
            collections.map((collection) => (
              <Carousel key={collection.id} title={collection.title}>
                {Array.isArray(collection.products) &&
                  collection.products.map((product) => (
                    <ProductCardDefault key={product.id} product={product} />
                  ))}
              </Carousel>
            ))}
        </Container>
      </div>
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  const collections = await getCollections();

  return {
    props: {
      collections,
    },
    revalidate: 60, // In seconds
  };
}
