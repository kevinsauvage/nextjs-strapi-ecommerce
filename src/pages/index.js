import Head from 'next/head';

import Banner1 from '@/components/_banners/BannerHome/Banner1';
import CollectionGrid from '@/components/_scopes/collection/CollectionGrid/CollectionGrid';
import CollectionBigBanner from '@/components/_scopes/home/CollectionBigBanner/CollectionBigBanner';
import CollectionsRow from '@/components/_scopes/home/CollectionsRow/CollectionsRow';
import ProductsDisplay from '@/components/_scopes/home/ProductsDisplay/ProductsDisplay';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import getClient from '@/shopify/index';

const Home = ({ bestSelling, newArrival, homeData }) => {
  const { banner, categories, featuredCollections, bigCardCollections } = homeData || {};

  return (
    <div>
      <Head>
        <title>{seo.home.title}</title>
        <meta key="description" name="description" content={seo.home.description} />
      </Head>
      <Banner1 data={banner} />
      <Container size="medium">
        {categories && <CollectionsRow collections={categories} />}
        {featuredCollections && <CollectionGrid collections={featuredCollections} />}
        <ProductsDisplay bestSelling={bestSelling} newArrival={newArrival} />
        {bigCardCollections && <CollectionBigBanner collections={bigCardCollections} />}
      </Container>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const bestSelling = await getClient().storefront.product.getProducts({ first: 9, sortKey: 'BEST_SELLING' });
  const newArrival = await getClient().storefront.product.getProducts({ first: 9, sortKey: 'CREATED_AT' });
  const homeData = await getClient().storefront.shop.getMetaObject({
    handle: { handle: 'page-data-home', type: 'page_data' },
  });

  return { props: { bestSelling, homeData, newArrival }, revalidate: 60 };
}
