import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import Pagination from '@/components/_scopes/product/Pagination/Pagination';
import Sort from '@/components/_scopes/product/Sort/Sort';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';
import CollectionBanner from '@/components/_scopes/collection/CollectionBanner/CollectionBanner';
import Wrapper from '@/components/Wrapper/Wrapper';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Filters from '@/components/_scopes/collection/Filters/Filters';
import { filter } from '@/assets/svg';
import { actions } from '@/contexts/CollectionContext/CollectionReducer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import CollectionNav from '@/components/_scopes/collection/CollectionNav/CollectionNav';
import Slide from '@/components/Slide/Slide';
import Container from '@/components/Container/Container';
import PageLayout from '../PageLayout/PageLayout';
import styles from './CollectionLayout.module.scss';

function CollectionLayout({ children, collection }) {
  const { handleSort, layout, dispatch: collectionDispatch, collectionNav } = useCollectionContext();
  const { filterOpen, toggleFilter } = useGlobalContext();
  const { title, description } = collection || {};

  return (
    <>
      <PageLayout title={title} description={description}>
        <CollectionNav items={collectionNav} />
        <Breadcrumbs lastElement={title} />
        <CollectionBanner title={title} description={description} />
        <div className={styles.header}>
          <Container>
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
          </Container>
        </div>
        <Container>
          <div className={styles.CollectionLayout}>
            <main className={styles.main}>
              <section className={styles.children}>{children}</section>
              <Pagination />
            </main>
          </div>
        </Container>
      </PageLayout>

      <Slide
        handleClose={() => toggleFilter(false)}
        isOpen={filterOpen}
        content={<Filters />}
        title="Filters"
      />
    </>
  );
}

export default CollectionLayout;
