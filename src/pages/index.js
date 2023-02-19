import Container from '@/components/Container/Container';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import ProductsDisplay from '@/components/_scopes/home/ProductsDisplay/ProductsDisplay';
import CollectionsRow from '@/components/_scopes/home/CollectionsRow/CollectionsRow';
import CollectionBigBanner from '@/components/_scopes/home/CollectionBigBanner/CollectionBigBanner';
import getClient from '@/shopify/index';

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
  const bestSelling = await getClient().product.getProducts({ sortKey: 'BEST_SELLING', first: 16 });
  const newArrival = await getClient().product.getProducts({ sortKey: 'CREATED_AT', first: 16 });
  const homeData = await getClient().shop.getPage({ handle: 'Home' });
  const homeData2 = await getClient().shop.getMetaObject({
    handle: { type: 'page_data', handle: 'page-data-home' },
  });

  return { props: { bestSelling, newArrival, homeData, homeData2: homeData2 || null }, revalidate: 60 };
}
