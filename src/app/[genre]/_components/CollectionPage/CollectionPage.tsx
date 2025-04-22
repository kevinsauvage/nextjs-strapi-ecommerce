import { filter } from '@/assets/svg';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import ProductEdgeList from '@/components/ProductEdgeList/ProductsEdgeList';
import SlideIn from '@/components/SlideIn/SlideIn';
import Wrapper from '@/components/Wrapper/Wrapper';
import type { Filter, PageInfo, ProductFieldsFragment } from '@/shopify/storefront';
import { type CollectionFieldsFragment } from '@/shopify/storefront';

import PageInfoPagination from '../../../../components/PageInfoPagination/PageInfoPagination';
import Filters from '../Filters/Filters';
import Sort from '../Sort/Sort';

import styles from './collectionPage.module.scss';

const CollectionPage = ({
  collection,
  searchParameters,
}: {
  collection: CollectionFieldsFragment & {
    products: {
      edges: { node: ProductFieldsFragment; cursor: string }[];
      pageInfo: PageInfo;
      filters: Array<Filter>;
    };
  };
  searchParameters: {
    after?: string;
    before?: string;
    filters?: string;
    sort_key?: string;
  };
}) => {
  const { filters, pageInfo, edges } = collection?.products || {};

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Container>
            {(edges?.length > 0 || filters?.length > 0) && (
              <Wrapper gap={16}>
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
          {edges?.length > 0 ? (
            <>
              <ProductEdgeList products={edges} layout="grid" />
              <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
            </>
          ) : (
            <EmptyState
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
