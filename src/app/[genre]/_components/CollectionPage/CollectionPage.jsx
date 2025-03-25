import notFoundIllustration from '@/assets/NotFoundIllustration.svg';
import { filter } from '@/assets/svg';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import ProductsList from '@/components/ProductList/ProductsList';
import SlideIn from '@/components/SlideIn/SlideIn';
import Wrapper from '@/components/Wrapper/Wrapper';

import PageInfoPagination from '../../../../components/PageInfoPagination/PageInfoPagination';
import Filters from '../Filters/Filters';
import Sort from '../Sort/Sort';

import styles from './collectionPage.module.scss';

const CollectionPage = ({ collection, searchParameters }) => {
  const { filters, pageInfo, products } = collection || {};
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Container>
            {(products?.length > 0 || filters?.length > 0) && (
              <Wrapper>
                <Sort query={searchParameters} />
                <SlideIn
                  headerTitle="Filters"
                  title={
                    <span className={styles['filter-button']}>
                      <p>Filters</p>
                      {filter}
                    </span>
                  }
                >
                  <Filters filters={filters} query={searchParameters} />
                </SlideIn>
              </Wrapper>
            )}
          </Container>
        </div>
        <Container>
          {products?.length > 0 ? (
            <>
              <ProductsList products={products} layout="grid" />
              <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
            </>
          ) : (
            <EmptyState
              image={notFoundIllustration}
              title="Result Not Found"
              subtitle="Please try again with another filters"
              altText="Result Not Found"
            />
          )}
        </Container>
      </main>
    </div>
  );
};

export default CollectionPage;
