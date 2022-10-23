import SecureBanner from '@/layout/SecureBanner/SecureBanner';
import Banner1 from '@/layout/BannerHome/Banner1';
import styles from '@/styles/Home.module.scss';
import Container from '@/layout/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getShop } from '@/lib/shopify/shop/shopApiCall';
import { getCollectionsWithProducts } from '@/lib/shopify/collection/collectionApiCall';
import routes from '@/data/routes';
import Carousel, { CarouselItem } from '@/components/Carousel/Carousel';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import CollectionCard from '@/components/CollectionCard/CollectionCard';
import Separator from '@/components/Separator/Separator';

export default function Home({ bestSelling, collections, newArrival }) {
  return (
    <div className={styles.container}>
      <Banner1 />
      <Container>
        {newArrival &&
          Array.isArray(newArrival.products) &&
          newArrival.products.length > 0 && (
            <Carousel
              title="Recommended Products"
              subtitle="Check out our recommended products"
              itemToShow={4}
              horizontal
              showButtons={false}
              showSeparator
            >
              {newArrival.products.map((prod) => (
                <CarouselItem key={prod.id}>
                  <ProductCardDefault product={prod} />
                </CarouselItem>
              ))}
            </Carousel>
          )}

        <Separator margin="60px 0" />
        {Array.isArray(collections) && collections.length > 0 && (
          <Carousel
            title="Popular Collections"
            subtitle="Save on all best selling and exclusive styles"
            itemToShow={3}
            horizontal
            showSeparator
            showButtons={false}
          >
            {collections.map((collection) => (
              <CarouselItem key={collection.id}>
                <CollectionCard collection={collection} />
              </CarouselItem>
            ))}
          </Carousel>
        )}
        <Separator margin="60px 0" />

        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <Carousel
              title="Best Selling"
              subtitle="Check out our best selling products"
              itemToShow={4}
              horizontal
              showButtons={false}
              showSeparator
            >
              {bestSelling.products.map((prod) => (
                <CarouselItem key={prod.id}>
                  <ProductCardDefault product={prod} />
                </CarouselItem>
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
  const shopInfo = await getShop();
  const newArrival = await getProducts('CREATED_AT', 20);
  const collections = await getCollectionsWithProducts(3);

  return {
    props: {
      bestSelling,
      shopInfo,
      collections,
      newArrival,
    },
    revalidate: 10,
  };
}
