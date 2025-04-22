import CollectionLayout from '../_components/CollectionLayout';

const CollectionSlugPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string; collectionSlug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { collectionSlug } = await params;
  const searchParameters = await searchParams;

  return <CollectionLayout collectionSlug={collectionSlug} searchParameters={searchParameters} />;
};

export default CollectionSlugPage;
