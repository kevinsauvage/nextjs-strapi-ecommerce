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
      if (query.filter.indexOf(value.id) !== -1) {
        acc.push(value);
      }
    });
    return acc;
  }, []);
  return newFilters;
};
const colors = [
  'black',
  'blue',
  'brown',
  'gray',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'white',
  'yellow',
  'gold',
  'silver',
  'bronze',
  'beige',
  'maroon',
  'olive',
  'navy',
  'turquoise',
  'violet',
  'indigo',
  'magenta',
  'crimson',
  'teal',
];

export const extractUniqueColorNames = (data) => {
  const colorMap = new Map();

  data.forEach((item) => {
    const color = item.label
      .toLowerCase()
      .split(' ')
      .filter((word) => colors.includes(word));
    if (color.length > 0) {
      colorMap.set(color[0], { ...item, label: color[0] });
    }
  });

  return [...colorMap.values()];
};
