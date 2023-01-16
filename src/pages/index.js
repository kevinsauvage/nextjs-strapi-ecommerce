import Container from '@/components/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import ProductsDisplay from '@/components/_scopes/home/ProductsDisplay/ProductsDisplay';

export default function Home({ bestSelling, collections, newArrival }) {
  return (
    <div>
      <Container>
        <Banner1 collections={collections?.slice(0, 1)} />
        <CollectionGrid collections={collections?.slice(1)} />
        <ProductsDisplay bestSelling={bestSelling} newArrival={newArrival} />
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 12);
  const newArrival = await getProducts('CREATED_AT', 12);
  const collections = await getCollections(5);
  return { props: { bestSelling, collections, newArrival }, revalidate: 60 };
}
