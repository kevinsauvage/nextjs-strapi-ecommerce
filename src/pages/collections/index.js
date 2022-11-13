import Page from '@/layout/Page/Page';
import Carousel, { CarouselItem } from '@/components/Carousel/Carousel';
import { getCollectionsWithProducts } from '@/lib/shopify/collection/collectionApiCall';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import Separator from '@/components/Separator/Separator';
import { Fragment } from 'react';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      {Array.isArray(collections) &&
        collections.map(
          (collection, i) =>
            collection.products.length > 0 && (
              <Fragment key={collection.id}>
                <Carousel
                  title={collection.title}
                  horizontal
                  showButtons={false}
                >
                  {Array.isArray(collection.products) &&
                    collection.products.map((product) => (
                      <CarouselItem key={product.id}>
                        <ProductCardDefault product={product} />
                      </CarouselItem>
                    ))}
                </Carousel>
                {i < collections.length - 1 && <Separator margin="60px 0" />}
              </Fragment>
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
