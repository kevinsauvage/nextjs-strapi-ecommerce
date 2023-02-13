import Container from '@/components/Container/Container';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import ProductsDisplay from '@/components/_scopes/home/ProductsDisplay/ProductsDisplay';
import CollectionsRow from '@/components/_scopes/home/CollectionsRow/CollectionsRow';
import CollectionBigBanner from '@/components/_scopes/home/CollectionBigBanner/CollectionBigBanner';
import { getPage } from '@/lib/shopify/shop/shopApiCall';

export default function Home({ bestSelling, newArrival, homeData }) {
  const { banner, categories, featuredCollections, bigCardCollections } = homeData || {};

  return (
    <div>
      <Banner1 data={banner} />
      <Container>
        {categories && <CollectionsRow collections={categories} />}
        {featuredCollections && <CollectionGrid collections={featuredCollections} />}
        <ProductsDisplay bestSelling={bestSelling} newArrival={newArrival} />
        {bigCardCollections && <CollectionBigBanner collections={bigCardCollections} />}
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 16);
  const newArrival = await getProducts('CREATED_AT', 16);
  const homeData = await getPage('Home');

  return { props: { bestSelling, newArrival, homeData }, revalidate: 60 };
}
