import CollectionBanner from '@/app/[genre]/_components/CollectionBanner/CollectionBanner';
import CollectionPage from '@/app/[genre]/_components/CollectionPage/CollectionPage';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import getClient from '@/shopify';

const parseFiltersQuery = (filters) => {
  if (!filters) return [];

  if (!Array.isArray(filters) && typeof filters === 'string') {
    const [, jsonPart] = filters.split(/:(.+)/);
    return [JSON.parse(jsonPart)];
  }

  return filters.map((item) => {
    const [, jsonPart] = item.split(/:(.+)/);
    return JSON.parse(jsonPart);
  });
};

const CollectionLayout = async ({ children, collectionSlug, searchParameters }) => {
  const collection = await getClient().storefront.collection.collection({
    after: searchParameters.after,
    before: searchParameters.before,
    filters: parseFiltersQuery(searchParameters?.filters),
    first: 10,
    handle: collectionSlug,
    sortKey: searchParameters.sort_key,
  });

  const { title, description } = collection || {};

  return (
    <div>
      <Breadcrumbs lastElement={title} />
      <CollectionBanner title={title} description={description} />
      <CollectionPage collection={collection} searchParameters={searchParameters} />
      {children}
    </div>
  );
};

export default CollectionLayout;
