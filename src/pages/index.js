import SecureBanner from '@/layout/SecureBanner/SecureBanner';
import Banner1 from '@/layout/BannerHome/Banner1';
import Container from '@/layout/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import Carousel from '@/components/Carousel/Carousel';
import ProductCardDefault from '@/components/scopes/product/ProductCardDefault/ProductCardDefault';
import CollectionCard from '@/components/CollectionCard/CollectionCard';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';

export default function Home({ bestSelling, collections, newArrival }) {
  return (
    <div>
      <Banner1 />
      <Container>
        {newArrival &&
          Array.isArray(newArrival.products) &&
          newArrival.products.length > 0 && (
            <Carousel
              title="Recommended Products"
              subtitle="Check out our recommended products"
              itemToShow={4}
            >
              {newArrival.products.map((prod) => (
                <ProductCardDefault product={prod} key={prod.id} />
              ))}
            </Carousel>
          )}
        {Array.isArray(collections) && collections.length > 0 && (
          <Carousel
            title="Popular Collections"
            subtitle="Save on all best selling and exclusive styles"
            itemToShow={3}
          >
            {collections.map((collection) => (
              <CollectionCard collection={collection} key={collection.id} />
            ))}
          </Carousel>
        )}
        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <Carousel
              title="Best Selling"
              subtitle="Check out our best selling products"
              itemToShow={4}
            >
              {bestSelling.products.map((prod) => (
                <ProductCardDefault product={prod} key={prod.id} />
              ))}
            </Carousel>
          )}
      </Container>
      <SecureBanner />
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const newArrival = await getProducts('CREATED_AT', 20);
  const collections = await getCollections(3);

  return {
    props: {
      bestSelling,
      collections,
      newArrival,
    },
    revalidate: 60,
  };
}
