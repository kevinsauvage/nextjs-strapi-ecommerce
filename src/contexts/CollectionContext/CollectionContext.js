import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';
import config from '@/config/index';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import { numberOfDifferences } from '@/helpers/array';
import { CollectionReducer, initialState, actions } from './CollectionReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';

export const CollectionContext = createContext();

export function CollectionProvider({ children, collection, pageInfo: initialPageInfo, collectionFilters }) {
  const { products: initialProducts } = collection || {};
  const [states, dispatch] = useReducer(CollectionReducer, initialState);
  const { loading, selectedFilters, pageInfo, products, allFilters, layout } = states;
  const { toggleFilter } = useGlobalContext();
  const { query, pathname, push, to, asPath } = useRouter();

  useEffect(() => {
    if (initialProducts) dispatch({ type: actions.SET_PRODUCTS, payload: initialProducts });
    if (initialPageInfo) dispatch({ type: actions.SET_PAGE_INFO, payload: initialPageInfo });
    if (collectionFilters) dispatch({ type: actions.SET_ALL_FILTERS, payload: collectionFilters });
  }, [collectionFilters, initialPageInfo, initialProducts]);

  const getFormattedFilter = useCallback(() => {
    const filteredFilters = getFiltersFromQuery(allFilters, query);
    return filteredFilters.map((item) => JSON.parse(item.input));
  }, [allFilters, query]);

  const handleGetData = useCallback(
    async (first, filters, sort, after = null) => {
      dispatch({ type: actions.SET_LOADING, payload: true });
      const data = await filterCollectionForward(query.collectionSlug || 'all', first, filters, sort, after);
      dispatch({ type: actions.SET_LOADING, payload: false });
      return data;
    },
    [query.collectionSlug]
  );

  const handleSetFilterState = useCallback(
    (data, concat = false) => {
      const {
        collection: { products: newProducts },
        pageInfo: newPageInfo,
      } = data || {};

      if (newPageInfo) dispatch({ type: actions.SET_PAGE_INFO, payload: newPageInfo });
      if (newProducts) {
        dispatch({
          type: actions.SET_PRODUCTS,
          payload: concat ? [...products, ...newProducts] : newProducts,
        });
      }
      if (!concat) window.scrollTo(0, 0);
    },
    [products]
  );

  const resetFilters = useCallback(async () => {
    toggleFilter(false);
    const newQuery = query.sort_key ? { sort_key: query.sort_key } : {};
    push({ pathname: asPath.split('?')[0], query: newQuery }, undefined, { shallow: true });
    const data = await handleGetData(15, [], query.sort_key, null);
    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
    handleSetFilterState(data);
  }, [asPath, handleGetData, handleSetFilterState, push, query, toggleFilter]);

  const applyFilters = useCallback(async () => {
    toggleFilter(false);
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);
    if (selectedFilters.length > 0)
      selectedFilters.forEach((item) => newUrl.searchParams.append('filter', item.id));
    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);

    push(newUrl, undefined, { shallow: true });
    const filters = selectedFilters.map((item) => JSON.parse(item.input));
    const data = await handleGetData(15, filters, query.sort_key, null);
    handleSetFilterState(data);
  }, [
    handleGetData,
    handleSetFilterState,
    pathname,
    push,
    query.collectionSlug,
    query.sort_key,
    selectedFilters,
    toggleFilter,
  ]);

  const handleSort = useCallback(
    async (value) => {
      if (!value) return null;
      push({ pathname: to, query: { ...query, sort_key: value } }, undefined, { shallow: true });
      const filters = getFormattedFilter();
      const data = await handleGetData(15, filters, value, null);
      return handleSetFilterState(data);
    },
    [getFormattedFilter, handleGetData, handleSetFilterState, push, query, to]
  );

  const handleNext = useCallback(async () => {
    const filters = getFormattedFilter();
    const data = await handleGetData(15, filters, query.sort_key, pageInfo.endCursor);
    handleSetFilterState(data, true);
  }, [getFormattedFilter, handleGetData, handleSetFilterState, pageInfo.endCursor, query.sort_key]);

  const isSelectionDifferent = useCallback(() => {
    const filteredFilters = getFiltersFromQuery(allFilters, query);
    return numberOfDifferences(filteredFilters, selectedFilters);
  }, [allFilters, query, selectedFilters]);

  useEffect(() => {
    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
  }, [query.collectionSlug]);

  useEffect(() => {
    if (query?.filter) {
      const filteredFilters = getFiltersFromQuery(allFilters, query);
      if (Array.isArray(filteredFilters)) {
        dispatch({ type: actions.SET_SELECTED_FILTERS, payload: filteredFilters });
      }
    } else dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
  }, [query, allFilters]);

  const values = useMemo(
    () => ({
      selectedFilters,
      allFilters,
      pageInfo,
      products,
      loading,
      layout,
      dispatch,
      applyFilters,
      resetFilters,
      handleSort,
      handleNext,
      isSelectionDifferent,
    }),
    [
      selectedFilters,
      allFilters,
      pageInfo,
      products,
      loading,
      layout,
      applyFilters,
      resetFilters,
      handleSort,
      handleNext,
      isSelectionDifferent,
    ]
  );

  return <CollectionContext.Provider value={values}>{children}</CollectionContext.Provider>;
}
