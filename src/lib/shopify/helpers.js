export const cleanGraphQLResponse = (data) => {
  let result = Array.isArray(data) ? [] : {};

  if (typeof data !== 'object') return data;

  // eslint-disable-next-line no-restricted-syntax
  for (const key in data) {
    if (typeof key === 'string' && key === 'edges') {
      result = cleanGraphQLResponse(data.edges.map((edge) => edge.node));
    } else {
      result = Object.assign(result, { [key]: data[key] ? cleanGraphQLResponse(data[key]) : null });
    }
  }

  return result;
};

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
