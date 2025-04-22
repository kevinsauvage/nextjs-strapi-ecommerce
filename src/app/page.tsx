import { ProductSortKeys } from '@/shopify/storefront/index';
import { notFound } from 'next/navigation';

import CollectionGrid from '@/app/[genre]/_components/CollectionGrid/CollectionGrid';
import Banner1 from '@/components/_banners/BannerHome/Banner1';
import CollectionBigBanner from '@/components/CollectionBigBanner/CollectionBigBanner';
import CollectionsRow from '@/components/CollectionsRow/CollectionsRow';
import Container from '@/components/Container/Container';
import ProductsDisplay from '@/components/ProductsDisplay/ProductsDisplay';
import { storefrontSdk } from '@/shopify/index';

export type HomePageData = {
  banner: BannerHomeType;
  categories: BannerHomeCategories[];
  featuredCollections: {
    title: string;
    handle: string;
    image: {
      url: string;
      alt: string;
    };
  }[];
  bigCardCollections: {
    title: string;
    subtitle: string;
    handle: string;
    image: {
      url: string;
      alt: string;
    };
  }[];
};

const Home = async () => {
  const bestSelling = await storefrontSdk().getProducts({
    first: 9,
    identifiers: [],
    sortKey: ProductSortKeys.BestSelling,
  });

  const newArrival = await storefrontSdk().getProducts({
    first: 9,
    identifiers: [],
    sortKey: ProductSortKeys.CreatedAt,
  });

  const homeData = await storefrontSdk().getShopMetaObjects({
    first: 100,
    type: 'page_data',
  });

  if (!homeData?.metaobjects.edges) {
    notFound();
  }

  const metaobjects = homeData?.metaobjects?.edges?.map((edge) => edge.node);

  const homeDataParsed = (
    metaobjects?.[0]?.fields?.[0]?.value
      ? (JSON.parse(metaobjects[0].fields[0].value) as HomePageData)
      : {}
  ) as HomePageData;

  return (
    <div>
      {homeDataParsed.banner && <Banner1 data={homeDataParsed.banner} />}
      <Container size="medium">
        {homeDataParsed.categories && <CollectionsRow collections={homeDataParsed.categories} />}
        {homeDataParsed.featuredCollections && (
          <CollectionGrid collections={homeDataParsed.featuredCollections} />
        )}
        <ProductsDisplay
          bestSelling={bestSelling.products.edges.map((edge) => edge.node)}
          newArrival={newArrival.products.edges.map((edge) => edge.node)}
        />
        {homeDataParsed.bigCardCollections && (
          <CollectionBigBanner collections={homeDataParsed.bigCardCollections} />
        )}
      </Container>
    </div>
  );
};

export default Home;
