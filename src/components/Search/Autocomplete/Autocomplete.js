/* eslint-disable react/no-unstable-nested-components */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
import { Fragment, createElement, useEffect, useRef, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { CartContext } from '@/contexts/CartContext/CartContext';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import styles from './Autocomplete.module.scss';
import '@algolia/autocomplete-theme-classic';
import ProductItem from '../ProductItem/ProductItem';

const appId = 'DD9FI7P48Z';
const apiKey = '3a6d58200005df1baa528946d412c1b8';

const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'shopify_products_query_suggestions',
  getSearchParams() {
    return {
      hitsPerPage: 5,
    };
  },
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        header({ state }) {
          if (state.query) {
            return null;
          }

          return (
            <>
              <span className="aa-SourceHeaderTitle">Popular searches</span>
              <div className="aa-SourceHeaderLine" />
            </>
          );
        },
      },
    };
  },
});

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'qs-with-rs-example',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        header({ state }) {
          if (state.query) {
            return null;
          }

          return (
            <>
              <span className="aa-SourceHeaderTitle">Your searches</span>
              <div className="aa-SourceHeaderLine" />
            </>
          );
        },
      },
    };
  },
});

function Autocomplete(props) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      openOnFocus: true,
      placeholder: 'Search',
      plugins: [querySuggestionsPlugin, recentSearchesPlugin],
      getSources({ query }) {
        if (!query) return [];

        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'shopify_products',
                    query,
                    params: {
                      attributesToSnippet: ['title:10'],
                      snippetEllipsisText: '…',
                    },
                  },
                ],
              });
            },
            templates: {
              header() {
                return (
                  <>
                    <span className="aa-SourceHeaderTitle">Products</span>
                    <div className="aa-SourceHeaderLine" />
                  </>
                );
              },
              item({ item, components }) {
                return (
                  <ProductItem
                    hit={item}
                    components={components}
                    addToCart={addToCart}
                  />
                );
              },
              noResults() {
                return 'No products for this query.';
              },
            },
          },
        ];
      },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      ...props,
    });

    document.querySelector('.aa-Input')?.focus();
    document.querySelector('body').style.overflow = 'hidden';

    return () => {
      document.querySelector('body').style.overflow = 'auto';

      search.destroy();
    };
  }, [props, addToCart]);

  return <div className={styles.autocomplete} ref={containerRef} />;
}

export default Autocomplete;
