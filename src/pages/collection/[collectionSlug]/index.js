import Page from '@/layout/Page/Page';
import { getFiltersFromParams } from '@/lib/shopify/helpers';
import {
  filterCollection,
  getCollectionFilters,
} from '@/lib/shopify/collection/collectionApiCall';
import { getProductTags } from '@/lib/shopify/product/productApiCall';
import ProductsList from '@/components/product/ProductList/ProductsList';

function CollectionSlugPage({
  title,
  products,
  filters,
  pageInfo,
  actualFilters,
}) {
  console.log(filters, 'availableFilters');
  return (
    <Page title={`${title}`}>
      <ProductsList
        products={products}
        hasNextPage={pageInfo?.hasNextPage}
        filters={filters}
        pageInfo={pageInfo}
        actualFilters={actualFilters}
      />
    </Page>
  );
}

export default CollectionSlugPage;

export async function getServerSideProps({ params, query }) {
  const page = query.page ? Number(query.page) * 10 : 10;

  const availableFilters = await getCollectionFilters(params.collectionSlug);

  if (!availableFilters) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const filtersFetchArray = getFiltersFromParams(availableFilters, query);

  const sortKey = query.sort_key ? query.sort_key : 'RELEVANCE';

  const data = await filterCollection(
    params.collectionSlug,
    page,
    filtersFetchArray,
    sortKey
  );

  const tags = await getProductTags();

  const products = data?.products;
  const pageInfo = data?.pageInfo;

  return {
    props: {
      title: params.collectionSlug,
      filters: availableFilters,
      products,
      pageInfo,
      actualFilters: query,
      filtersFetchArray,
      tags,
    },
  };
}
