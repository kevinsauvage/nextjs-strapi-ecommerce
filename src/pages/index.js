import SecureBanner from '@/layout/SecureBanner/SecureBanner';
import Banner1 from '@/layout/BannerHome/Banner1';
import styles from '@/styles/Home.module.scss';
import Container from '@/layout/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getShop } from '@/lib/shopify/shop/shopApiCall';
import { getCollectionsWithProducts } from '@/lib/shopify/collection/collectionApiCall';
import CollectionUi from '@/layout/CollectionUi/CollectionUi';
import routes from '@/data/routes';

export default function Home({ bestSelling, collections, newArrival }) {
  console.log(newArrival);
  return (
    <div className={styles.container}>
      <Banner1 />
      <Container>
        {newArrival &&
          Array.isArray(newArrival.products) &&
          newArrival.products.length > 0 && (
            <CollectionUi
              title="New Arrival"
              products={newArrival?.products}
              itemShown={10}
            />
          )}
        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <CollectionUi
              title="Best Selling"
              products={bestSelling?.products}
              itemShown={10}
            />
          )}
        {Array.isArray(collections) &&
          collections.length > 0 &&
          collections.map((collection) => (
            <CollectionUi
              key={collection.id}
              title={collection?.title}
              products={collection?.products}
              link={`${routes.collection}/${collection?.handle}`}
              buttonText="See more"
              itemShown={10}
            />
          ))}
      </Container>
      <SecureBanner />
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const shopInfo = await getShop();
  const newArrival = await getProducts('CREATED_AT', 10);

  const collections = await getCollectionsWithProducts(2);
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
