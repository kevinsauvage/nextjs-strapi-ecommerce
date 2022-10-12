// eslint-disable-next-line import/prefer-default-export
export const getFiltersFromParams = (filters, actualFilters) => {
  if (!Object.keys(actualFilters).length) return [];

  const filtered = filters.reduce((acc, filter) => {
    Object.keys(actualFilters).forEach((key) => {
      if (filter.id === key) {
        filter.values.forEach((value) => {
          if (key === 'filter.v.price') {
            // eslint-disable-next-line no-param-reassign
            acc = [...acc, JSON.parse(value.input)];
            return;
          }
          if (Array.isArray(actualFilters[key])) {
            if (actualFilters[key].includes(value.id)) {
              // eslint-disable-next-line no-param-reassign
              acc = [...acc, JSON.parse(value.input)];
            }
          } else if (value.id === actualFilters[key]) {
            // eslint-disable-next-line no-param-reassign
            acc = [...acc, JSON.parse(value.input)];
          }
        });
      }
    });

    return acc;
  }, []);

  return filtered;
};

export const cleanCollections = (collections) => {
  if (!Array.isArray(collections)) return [];

  return collections.map((collection) => ({
    ...collection.node,
    // eslint-disable-next-line no-use-before-define
    products: cleanProducts(collection?.node?.products?.edges),
  }));
};

export const parseShopifyResponse = (response) =>
  JSON.parse(JSON.stringify(response));

export const cleanVariants = (variants = []) => {
  if (!variants.length) return [];
  return variants.map((variant) => ({
    ...variant.node,
  }));
};

const cleanImage = (images) =>
  images.map((image) => ({
    ...image.node,
  }));

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

const getValueByKey = (key, attribute) => {
  const arrayAtt = attribute.filter((att) => att.key === key);
  const product = arrayAtt[0].value;
  return JSON.parse(product);
};

export const parseCart = (cart) => ({
  ...cart,
  lines: cart.lines.edges.map((line) => ({
    ...line.node,
    product: getValueByKey('product', line.node.attributes),
  })),
});
