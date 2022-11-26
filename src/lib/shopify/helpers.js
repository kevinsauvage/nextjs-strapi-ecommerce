// eslint-disable-next-line import/prefer-default-export
export const getFiltersFromParams = (filters, actualFilters) => {
  if (!Object.keys(actualFilters).length) return [];

  const filtered = filters.reduce((acc, filter) => {
    Object.keys(actualFilters).forEach((key) => {
      if (filter.id === key) {
        if (Array.isArray(actualFilters[key])) {
          // eslint-disable-next-line no-param-reassign
          acc = [...acc, ...actualFilters[key].map((f) => JSON.parse(f))];
        } else {
          // eslint-disable-next-line no-param-reassign
          acc = [...acc, JSON.parse(actualFilters[key])];
        }
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

export const cleanImage = (images) =>
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

export const parseCart = (cart) =>
  Array.isArray(cart?.lines?.edges)
    ? {
        ...cart,
        lines: cart.lines.edges.map((line) => ({
          ...line.node,
          product: getValueByKey('product', line.node.attributes),
        })),
      }
    : cart;
