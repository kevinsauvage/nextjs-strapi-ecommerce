import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import {
  filterCollection,
  getCollectionFilters,
} from '@/lib/shopify/collections';

const getFiltersFromParams = (filters, actualFilters) => {
  const data = [
    ...filters.reduce((result, filter) => {
      const foundedFilter = actualFilters[filter.id];

      if (foundedFilter) {
        return [
          ...result,
          ...filter.values.reduce((acc, el) => {
            if (
              Array.isArray(foundedFilter)
                ? foundedFilter.includes(el.label)
                : [foundedFilter].includes(el.label)
            ) {
              const parsed = JSON.parse(el.input);

              return [...acc, parsed];
            }
            return acc;
          }, []),
        ];
      }
      return result;
    }, []),
  ];
  return data;
};

function CategoryPage({ title, products, filters, pageInfo, actualFilters }) {
  getFiltersFromParams(filters, actualFilters);
  return (
    <Page title={`${title}`}>
      <Container>
        <ProductsList
          products={products}
          hasNextPage={pageInfo.hasNextPage}
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

  const data = await filterCollection(params.slug, page, filtersFetchArray);

  const products = data?.products;
  const pageInfo = data?.pageInfo;

  return {
    props: {
      title: params.slug,
      filters: availableFilters,
      products,
      pageInfo,
      actualFilters: query,
      filtersFetchArray,
    },
  };
}

/* export async function getStaticPaths({ locales, locale }) {
  const data = await getShopifyClient(locale).collection.fetchAll();
  const collections = parseShopifyResponse(data);

  const paths = locales.reduce(
    (acc, next) => [
      ...acc,
      ...collections.map((cat) => ({
        params: { slug: String(cat.handle) },
        locale: next,
      })),
    ],
    []
  );

  return {
    paths,
    fallback: false,
  };
}
 */
