import algoliasearch from 'algoliasearch/lite';

const appId = 'DD9FI7P48Z';
const apiKey = '3a6d58200005df1baa528946d412c1b8';

export const searchClient = algoliasearch(appId, apiKey);

export const getLastOrderedProducts = async (language) => {
  const index = searchClient.initIndex(
    'shopify_products_recently_ordered_count_desc'
  );
  index.setSettings({
    queryLanguages: [language],
    ignorePlurals: true,
  });
  return index.search('');
};
