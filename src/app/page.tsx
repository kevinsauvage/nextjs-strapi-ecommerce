import type { Metadata } from 'next';

import PageBanner from '@/components/PageBanner';
import ProductsList from '@/components/ProductsList';
import SectionTitle from '@/components/SectionTitle';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';
import { CollectionSortKeys, ProductSortKeys } from '@/shopify/storefront/index';

import CollectionGrid from '../components/CollectionGrid/CollectionGrid';

export const metadata: Metadata = {
  description: seo.home.description,
  title: seo.home.title,
};

const Home = async () => {
  const collections = await storefrontSdk().collections({
    first: 100,
    firstProducts: 1,
    identifiers: [
      {
        key: 'featured',
        namespace: 'custom',
      },
    ],
    sortKey: CollectionSortKeys?.Relevance,
  });

  const bestSelling = await storefrontSdk().getProducts({
    first: 8,
    identifiers: [],
    sortKey: ProductSortKeys.BestSelling,
  });
  const newArrival = await storefrontSdk().getProducts({
    first: 8,
    identifiers: [],
    sortKey: ProductSortKeys.CreatedAt,
  });

  const featuredCollections = collections.collections.edges.filter((collection) =>
    collection.node.metafields.find((metafield) => metafield?.key === 'featured'),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PageBanner
        title="Shop the Latest Trends"
        description="Discover the latest trends and exclusive collections that will elevate your style. Shop
        now and enjoy a seamless shopping experience with us. From fashion to home decor, we have
        something for everyone."
      />
      {featuredCollections.length > 0 ? <CollectionGrid collections={featuredCollections} /> : null}
      <SectionTitle>Featured Products</SectionTitle>
      <ProductsList products={bestSelling.products.edges.map((edge) => edge.node)} layout="grid" />
      <SectionTitle>New Arrival</SectionTitle>
      <ProductsList products={newArrival.products.edges.map((edge) => edge.node)} layout="grid" />
    </div>
  );
};

export default Home;
