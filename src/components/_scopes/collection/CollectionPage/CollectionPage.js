/* eslint-disable no-nested-ternary */
import { filter } from '@/assets/svg';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import SlideIn from '@/components/SlideIn/SlideIn';
import Wrapper from '@/components/Wrapper/Wrapper';
import useCollectionContext from '@/contexts/CollectionContext/useCollectionContext';

import Sort from '../../product/Sort/Sort';
import Filters from '../Filters/Filters';

import styles from './collectionPage.module.scss';

function CollectionPage() {
  const { loading, products, layout, handleNext, pageInfo, handleSort } = useCollectionContext();

  return (
    <div className={styles.CollectionPage}>
      <main className={styles.main}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <Container>
              <Wrapper>
                <Sort handleChange={handleSort} />
                <SlideIn
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
            </Container>
          </div>
        </div>
        <Container>
          <ProductsList
            handleNext={handleNext}
            hasNextPage={pageInfo?.hasNextPage}
            products={products}
            layout={layout}
            loading={loading}
          />
        </Container>
      </main>
    </div>
  );
}

export default CollectionPage;
