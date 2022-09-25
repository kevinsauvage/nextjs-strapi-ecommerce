// eslint-disable-next-line import/prefer-default-export
export const getFiltersFromParams = (filters) => {
  if (!Object.keys(filters).length) return [];

  const actualFilters = Object.keys(filters).map((key) => {
    if (Array.isArray(filters[key])) {
      return filters[key].map((filter) => JSON.parse(filter));
    }
    return JSON.parse(filters[key]);
  });

  return actualFilters.flat();
};

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
    }));
  }
  if (prods?.[0]?.id) {
    products = prods.map((product) => ({
      ...product,
      images: cleanImage(product?.images?.edges),
      variants: cleanVariants(product?.variants?.edges),
    }));
  }

  return products || prods;
};

export const cleanCollections = async (collections) =>
  collections.map((collection) => ({
    ...collection.node,
    products: cleanProducts(collection.node.products.edges),
  }));
