import Container from '@/components/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import ProductsDisplay from '@/components/_scopes/home/ProductsDisplay/ProductsDisplay';
import { getHomePage } from '@/lib/shopify/shop/shopApiCall';
import CollectionsRow from '@/components/_scopes/collection/CollectionsRow/CollectionsRow';

export default function Home({ bestSelling, newArrival, homeData }) {
  console.log('🚀 ~ file: index.js:12 ~ Home ~ homeData', homeData);
  const { banner, categories, featuredCollections } = homeData || {};

  return (
    <div>
      <Container>
        <Banner1 data={banner} />
        {categories && <CollectionsRow collections={categories} />}
        <CollectionGrid collections={featuredCollections} />
        <ProductsDisplay bestSelling={bestSelling} newArrival={newArrival} />
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 16);
  const newArrival = await getProducts('CREATED_AT', 16);
  const homeData = await getHomePage();

  return { props: { bestSelling, newArrival, homeData }, revalidate: 60 };
}
