import CollectionLayout from '../_components/CollectionLayout';

const CollectionSlugPage = async ({ params, searchParams }) => {
  const { collectionSlug } = await params;
  const searchParameters = await searchParams;

  return <CollectionLayout collectionSlug={collectionSlug} searchParameters={searchParameters} />;
};

export default CollectionSlugPage;
