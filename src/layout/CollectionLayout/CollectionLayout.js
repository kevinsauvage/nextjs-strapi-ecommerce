import CollectionBanner from '@/components/_scopes/collection/CollectionBanner/CollectionBanner';
import CollectionNav from '@/components/_scopes/collection/CollectionNav/CollectionNav';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

import PageLayout from '../PageLayout/PageLayout';

const CollectionLayout = ({ children }) => {
  const { collectionNav, collection } = useCollectionContext();
  const { title, description } = collection || {};

  return (
    <PageLayout title={title} description={description}>
      <CollectionNav items={collectionNav} />
      <Breadcrumbs lastElement={title} />
      <CollectionBanner title={title} description={description} />
      {children}
    </PageLayout>
  );
};

export default CollectionLayout;
