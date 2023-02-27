import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import CollectionBanner from '@/components/_scopes/collection/CollectionBanner/CollectionBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import CollectionNav from '@/components/_scopes/collection/CollectionNav/CollectionNav';
import Container from '@/components/Container/Container';
import PageLayout from '../PageLayout/PageLayout';
import styles from './CollectionLayout.module.scss';

function CollectionLayout({ children, collection }) {
  const { collectionNav } = useCollectionContext();
  const { title, description, image } = collection || {};

  return (
    <PageLayout title={title} description={description}>
      <CollectionNav items={collectionNav} />
      <Breadcrumbs lastElement={title} />
      <CollectionBanner title={title} description={description} image={image} />
      <Container>
        <div className={styles.children}>{children}</div>
      </Container>
    </PageLayout>
  );
}

export default CollectionLayout;
