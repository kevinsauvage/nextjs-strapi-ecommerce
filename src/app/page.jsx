import CollectionGrid from '@/app/[genre]/_components/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import CollectionBigBanner from '@/components/CollectionBigBanner/CollectionBigBanner';
import CollectionsRow from '@/components/CollectionsRow/CollectionsRow';
import Container from '@/components/Container/Container';
import ProductsDisplay from '@/components/ProductsDisplay/ProductsDisplay';
import getClient from '@/shopify/index';

const Home = async () => {
  const bestSelling = await getClient().storefront.product.getProducts({
    first: 9,
    sortKey: 'BEST_SELLING',
  });
  const newArrival = await getClient().storefront.product.getProducts({
    first: 9,
    sortKey: 'CREATED_AT',
  });
  const homeData = await getClient().storefront.shop.getMetaObject({
    handle: { handle: 'page-data-home', type: 'page_data' },
  });

  const { banner, categories, featuredCollections, bigCardCollections } = homeData || {};

  return (
    <div>
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
