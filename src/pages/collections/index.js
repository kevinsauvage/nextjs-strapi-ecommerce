import Page from '@/layout/Page/Page';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import CollectionCard from '@/components/scopes/collection/CollectionCard/CollectionCard';
import style from './Collections.module.scss';

function CategoryPage({ collections }) {
  return (
    <Page title="Collections">
      <div className={style.grid}>
        {Array.isArray(collections) &&
          collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
      </div>
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps() {
  const collections = await getCollections(50);

  return {
    props: {
      collections,
    },
    revalidate: 60, // In seconds
  };
}
