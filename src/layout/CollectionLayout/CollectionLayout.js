import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Pagination from '@/components/_scopes/product/Pagination/Pagination';
import Sort from '@/components/_scopes/product/Sort/Sort';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import CollectionBanner from '@/components/_scopes/collection/CollectionBanner/CollectionBanner';
import Wrapper from '@/components/Wrapper/Wrapper';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Slide from '@/components/_slides/Slide/Slide';
import Filters from '@/components/_scopes/collection/Filters/Filters';
import { filter } from '@/assets/svg';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import CollectionNav from '@/components/_scopes/collection/CollectionNav/CollectionNav';
import PageLayout from '../PageLayout/PageLayout';
import styles from './CollectionLayout.module.scss';

function CollectionLayout({ children, collection }) {
  const { handleSort, layout, dispatch: collectionDispatch, collectionNav } = useCollectionContext();
  const { filterOpen, toggleFilter } = useGlobalContext();
  const { title, description } = collection || {};

  return (
    <>
      <CollectionNav items={collectionNav} />
      <Breadcrumbs lastElement={title} />

      <PageLayout title={title} description={description}>
        <Slide
          handleClose={() => toggleFilter(false)}
          isOpen={filterOpen}
          content={<Filters />}
          title="Filters"
        />
        <div className={styles.CollectionLayout}>
          <CollectionBanner title={title} description={description} />
          <main className={styles.main}>
            <div className={styles.header}>
              <LayoutButtons
                handleChange={(payload) => collectionDispatch({ type: actions.SET_LAYOUT, payload })}
                selected={layout}
              />
              <Wrapper>
                <Sort handleChange={handleSort} />
                <button className={styles.filterButton} type="button" onClick={() => toggleFilter(true)}>
                  {filter} Filter
                </button>
              </Wrapper>
            </div>
            <section className={styles.children}>{children}</section>
            <Pagination />
          </main>
        </div>
      </PageLayout>
    </>
  );
}

export default CollectionLayout;
