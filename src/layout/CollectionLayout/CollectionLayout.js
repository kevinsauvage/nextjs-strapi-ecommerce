import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
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
import FilterManager from '@/components/_scopes/collection/Filters/FilterManager/FilterManager';
import { useRouter } from 'next/router';
import { getFiltersFromQuery } from '@/helpers/index';
import PageLayout from '../PageLayout/PageLayout';
import styles from './CollectionLayout.module.scss';

function CollectionLayout({ children, collection }) {
  const {
    handleSort,
    layout,
    dispatch: collectionDispatch,
    collectionNav,
    allFilters,
  } = useCollectionContext();

  const { filterOpen, toggleFilter } = useGlobalContext();
  const { title, description } = collection || {};
  const { query } = useRouter();

  return (
    <>
      <PageLayout title={title} description={description}>
        <CollectionNav items={collectionNav} />
        <Breadcrumbs lastElement={title} />
        <CollectionBanner title={title} description={description} />
        <div className={styles.header}>
          <Container size="medium">
            <LayoutButtons
              handleChange={(payload) => collectionDispatch({ type: actions.SET_LAYOUT, payload })}
              selected={layout}
            />
            <Wrapper>
              <Sort handleChange={handleSort} />
              <button className={styles.filterButton} type="button" onClick={() => toggleFilter(true)}>
                {filter} Filter{' '}
                <small>
                  {getFiltersFromQuery(allFilters, query).length
                    ? `(${getFiltersFromQuery(allFilters, query).length.toString()})`
                    : null}
                </small>
              </button>
            </Wrapper>
          </Container>
        </div>
        <Container>
          <div className={styles.CollectionLayout}>
            <main className={styles.main}>
              <section className={styles.children}>{children}</section>
            </main>
          </div>
        </Container>
      </PageLayout>

      <Slide
        handleClose={() => toggleFilter(false)}
        isOpen={filterOpen}
        content={<Filters />}
        title="Filters"
        footer={<FilterManager />}
      />
    </>
  );
}

export default CollectionLayout;
