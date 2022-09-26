import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import { getFiltersFromParams } from '@/lib/shopify/helpers';
import {
  filterCollection,
  getCollectionFilters,
} from '@/lib/shopify/collection/collectionApiCall';
import { getProductTags } from '@/lib/shopify/product/productApiCall';

function CategoryPage({ title, products, filters, pageInfo, actualFilters }) {
  return (
    <Page title={`${title}`}>
      <Container>
        <ProductsList
          products={products}
          hasNextPage={pageInfo?.hasNextPage}
          filters={filters}
          pageInfo={pageInfo}
          actualFilters={actualFilters}
        />
      </Container>
    </Page>
  );
}

export default CategoryPage;

export async function getServerSideProps({ params, query }) {
  const page = query.page ? Number(query.page) * 10 : 10;

  const availableFilters = await getCollectionFilters(params.slug);

  const filtersFetchArray = getFiltersFromParams(availableFilters, query);

  const sortKey = query.sort_key ? query.sort_key : 'RELEVANCE';

  const data = await filterCollection(
    params.slug,
    page,
    filtersFetchArray,
    sortKey
  );

  const tags = await getProductTags();

  const products = data?.products;
  const pageInfo = data?.pageInfo;

  return {
    props: {
      title: params.slug,
      filters: availableFilters,
      products,
      pageInfo,
      actualFilters: query,
      tags,
    },
  };
}
