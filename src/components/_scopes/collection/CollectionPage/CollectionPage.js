import notFoundIllustration from '@/assets/NotFoundIllustration.svg';
import { filter } from '@/assets/svg';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import SlideIn from '@/components/SlideIn/SlideIn';
import Wrapper from '@/components/Wrapper/Wrapper';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

import Sort from '../../product/Sort/Sort';
import Filters from '../Filters/Filters';

import styles from './collectionPage.module.scss';

const CollectionPage = () => {
  const { loading, products, layout, handleNext, pageInfo, handleSort, getFormattedFilter } =
    useCollectionContext();

  return (
    <div className={styles.CollectionPage}>
      <main className={styles.main}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <Container>
              {(products?.length > 0 || getFormattedFilter().length > 0) && (
                <Wrapper>
                  <Sort handleChange={handleSort} />
                  <SlideIn
                    headerTitle="Filters"
                    title={
                      <span className={styles.filterButton}>
                        <p>Filters</p>
                        {filter}
                      </span>
                    }
                  >
                    <aside className={styles.aside}>
                      <Filters />
                    </aside>
                  </SlideIn>
                </Wrapper>
              )}
            </Container>
          </div>
        </div>
        <Container>
          {loading || products?.length > 0 ? (
            <ProductsList
              handleNext={handleNext}
              hasNextPage={pageInfo?.hasNextPage}
              products={products}
              layout={layout}
              loading={loading}
            />
          ) : (
            <EmptyState
              image={notFoundIllustration}
              title="Result Not Found"
              subtitle="Please try again with another filters"
            />
          )}
        </Container>
      </main>
    </div>
  );
};

export default CollectionPage;
