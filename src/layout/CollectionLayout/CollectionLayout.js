import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Filters from '@/components/_scopes/collection/Filters/Filters';
import Pagination from '@/components/_scopes/product/Pagination/Pagination';
import Sort from '@/components/_scopes/product/Sort/Sort';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import CollectionBanner from '@/components/_scopes/collection/CollectionBanner/CollectionBanner';
import CollectionNav from '@/components/_scopes/collection/CollectionNav/CollectionNav';
import styles from './CollectionLayout.module.scss';
import PageLayout from '../PageLayout/PageLayout';

function CollectionLayout({ children, collection }) {
  const { handleSort, handleSetLayout, layout } = useCollectionContext();

  const { title, description } = collection || {};

  return (
    <PageLayout title={title} description={description}>
      <div className={styles.CollectionLayout}>
        <CollectionBanner title={title} description={description} />
        <CollectionNav title={title} />
        <div className={styles.container}>
          <aside>
            <Filters />
          </aside>
          <main className={styles.main}>
            <div className={styles.header}>
              <LayoutButtons handleChange={handleSetLayout} selected={layout} />
              <Sort handleChange={handleSort} />
            </div>
            <section className={styles.children}>{children}</section>
            <Pagination />
          </main>
        </div>
      </div>
    </PageLayout>
  );
}

export default CollectionLayout;
