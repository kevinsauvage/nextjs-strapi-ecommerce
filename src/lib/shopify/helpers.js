/**
 * It takes an array of collections, and returns an array of collections with the products property
 * being an array of products
 * @param collections - Array
 * @returns An array of objects.
 */
export const cleanCollections = (collections) => {
  if (!Array.isArray(collections)) return [];

  return collections.map((collection) => ({
    ...collection.node,
    // eslint-disable-next-line no-use-before-define
    products: cleanProducts(collection?.node?.products?.edges),
  }));
};

/**
 * It takes an array of objects, and returns an array of objects with only the `node` property
 * @param [variants] - Array of variants
 * @returns An array of objects.
 */
export const cleanVariants = (variants = []) => {
  if (!variants.length) return [];
  return variants.map((variant) => ({
    ...variant.node,
  }));
};

/**
 * It takes an array of objects, and returns an array of objects with the same keys, but with the
 * values of the keys being the same as the values of the keys in the original objects
 * @param images - This is the array of images that we're going to clean up.
 */
export const cleanImage = (images) =>
  images.map((image) => ({
    ...image.node,
  }));

/**
 * It takes an array of products, and returns an array of products with the images, variants, and
 * collections cleaned up.
 * @param prods - [{node: {...}, node: {...}}, {node: {...}, node: {...}}]
 * @returns An array of objects.
 */
export const cleanProducts = (prods) => {
  let products = [];
  if (prods?.[0]?.node) {
    products = prods.map((product) => ({
      ...product.node,
      images: cleanImage(product.node?.images?.edges),
      variants: cleanVariants(product.node?.variants?.edges),
      collections: cleanCollections(product.node?.collections?.edges) || [],
    }));
  }
  if (prods?.[0]?.id) {
    products = prods.map((product) => ({
      ...product,
      images: cleanImage(product?.images?.edges),
      variants: cleanVariants(product?.variants?.edges),
      collections: cleanCollections(product?.collections?.edges) || [],
    }));
  }

  return products || prods;
};

/**
 * It takes a GraphQL response and returns a new object with the same data, but without the __typename
 * and edges properties
 * @param input - The input object to clean.
 * @returns an object.
 */
export const cleanGraphQLResponse = function (input) {
  if (!input) return null;
  const output = {};
  const isObject = (obj) =>
    obj !== null && typeof obj === 'object' && !Array.isArray(obj);

  Object.keys(input).forEach((key) => {
    if (input[key] && input[key].edges) {
      output[key] = input[key].edges.map((edge) =>
        cleanGraphQLResponse(edge.node)
      );
    } else if (isObject(input[key])) {
      output[key] = cleanGraphQLResponse(input[key]);
    } else if (key !== '__typename') {
      output[key] = input[key];
    }
  });

  return output;
};

/**
 * It takes an array of filters and a query object, and returns an array of filter values that are
 * present in the query object
 * @param filters - [{id: 'color', values: [{id: 'red', name: 'Red'}, {id: 'blue', name: 'Blue'}]},
 * {id: 'size', values: [{id: 'small', name: 'Small'}, {id:
 * @param query - {
 * @returns An array of objects.
 */
export const getFiltersFromQuery = (filters, query) => {
  if (!query.filter) return [];
  const newFilters = filters.reduce((acc, filter) => {
    filter.values.forEach((value) => {
      if (query.filter.includes(value.id)) {
        acc.push(value);
      }
    });
    return acc;
  }, []);
  return newFilters;
};
