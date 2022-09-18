// eslint-disable-next-line import/prefer-default-export
export const getFiltersFromParams = (filters = [], actualFilters) => {
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

const cleanVariants = (variants) =>
  variants.map((variant) => ({
    ...variant.node,
  }));

const cleanImage = (images) =>
  images.map((image) => ({
    ...image.node,
  }));

export const cleanProducts = (prods) => {
  let products = [];
  if (prods[0].node) {
    products = prods.map((product) => ({
      ...product.node,
      images: cleanImage(product.node.images.edges),
      variants: cleanVariants(product.node.variants.edges),
    }));
  }
  if (prods[0].id) {
    products = prods.map((product) => ({
      ...product,
      images: cleanImage(product.images.edges),
      variants: cleanVariants(product.variants.edges),
    }));
  }
  return products;
};
