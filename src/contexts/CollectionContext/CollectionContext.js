import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';
import config from '@/config/index';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import { filterCollectionForward } from '@/lib/shopify/collection/collectionApiCall';
import { CollectionReducer, initialState, actions } from './CollectionReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';

export const CollectionContext = createContext();

export function CollectionProvider({ children }) {
  const [states, dispatch] = useReducer(CollectionReducer, initialState);
  const {
    loading,
    notAppliedFilters,
    selectedFilters,
    actualFilters,
    pageInfo,
    products,
    allFilters,
    layout,
  } = states;

  const { toggleFilter } = useGlobalContext();
  const { query, pathname, push, asPath, href } = useRouter();

  const setPageInfo = useCallback((payload) => dispatch({ type: actions.SET_PAGE_INFO, payload }), []);
  const setProducts = useCallback((payload) => dispatch({ type: actions.SET_PRODUCTS, payload }), []);
  const setAllFilters = useCallback((payload) => dispatch({ type: actions.SET_ALL_FILTERS, payload }), []);
  const handleSetLayout = useCallback((data) => dispatch({ type: actions.SET_LAYOUT, payload: data }), []);
  const setSelectedFilters = useCallback(
    (payload) => dispatch({ type: actions.SET_SELECTED_FILTERS, payload }),
    []
  );

  const isSelectionDifferent = useCallback(() => {
    if (notAppliedFilters.length) return true;
    if (selectedFilters.length !== actualFilters.length) return true;
    return false;
  }, [actualFilters.length, notAppliedFilters.length, selectedFilters.length]);

  const removeFilter = useCallback(
    (filterId) => setSelectedFilters(selectedFilters.filter((f) => f.id !== filterId)),
    [selectedFilters, setSelectedFilters]
  );

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

      if (newPageInfo) setPageInfo(newPageInfo);
      if (newProducts) setProducts(concat ? [...products, ...newProducts] : newProducts);
      if (!concat) window.scrollTo(0, 0);
    },
    [products, setPageInfo, setProducts]
  );

  const resetFilters = useCallback(async () => {
    toggleFilter(false);
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);
    push(newUrl, undefined, { shallow: true });
    const data = await handleGetData(15, [], query.sort_key, null);
    handleSetFilterState(data);
  }, [
    handleGetData,
    handleSetFilterState,
    pathname,
    push,
    query.collectionSlug,
    query.sort_key,
    toggleFilter,
  ]);

  const applyFilters = useCallback(async () => {
    toggleFilter(false);
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);
    if (selectedFilters.length > 0)
      selectedFilters.forEach((item) => newUrl.searchParams.append('filter', item.id));
    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);
    if (isSelectionDifferent() && newUrl.href === href) return;
    push(newUrl, undefined, { shallow: true });
    const filters = selectedFilters.map((item) => JSON.parse(item.input));
    const data = await handleGetData(15, filters, query.sort_key, null);
    handleSetFilterState(data);
  }, [
    handleGetData,
    handleSetFilterState,
    href,
    isSelectionDifferent,
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
      const newUrl = new URL(config.baseUrl + asPath);
      newUrl.searchParams.set('sort_key', value);
      push(newUrl, undefined, { shallow: true });
      const filters = actualFilters.map((filter) => JSON.parse(filter.input));
      const data = await handleGetData(15, filters, value, null);
      return handleSetFilterState(data);
    },
    [actualFilters, asPath, handleGetData, handleSetFilterState, push]
  );

  const handleNext = useCallback(async () => {
    const filteredFilters = getFiltersFromQuery(allFilters, query);
    const filters = filteredFilters.map((item) => JSON.parse(item.input));
    const data = await handleGetData(15, filters, query.sort_key, pageInfo.endCursor);
    handleSetFilterState(data, true);
  }, [allFilters, handleGetData, handleSetFilterState, pageInfo.endCursor, query]);

  useEffect(() => {
    setSelectedFilters([]);
  }, [query.collectionSlug, setSelectedFilters]);

  useEffect(() => {
    if (query?.filter) {
      const filteredFilters = getFiltersFromQuery(allFilters, query);
      if (Array.isArray(filteredFilters)) setSelectedFilters(filteredFilters);
    }
  }, [query, allFilters, setSelectedFilters]);

  useEffect(() => {
    const values = getFiltersFromQuery(allFilters, query);
    dispatch({ type: actions.SET_ACTUAL_FILTERS, payload: values });
  }, [allFilters, query]);

  useEffect(() => {
    const result = selectedFilters.filter((obj) => actualFilters.every((s) => s.id !== obj.id));
    dispatch({ type: actions.SET_NOT_APPLIED_FILTERS, payload: result });
  }, [actualFilters, selectedFilters]);

  const values = useMemo(
    () => ({
      selectedFilters,
      actualFilters,
      allFilters,
      pageInfo,
      products,
      loading,
      layout,
      isSelectionDifferent,
      setSelectedFilters,
      setAllFilters,
      removeFilter,
      applyFilters,
      resetFilters,
      setPageInfo,
      setProducts,
      handleSort,
      handleNext,
      handleSetLayout,
    }),
    [
      selectedFilters,
      actualFilters,
      allFilters,
      pageInfo,
      products,
      loading,
      layout,
      isSelectionDifferent,
      setSelectedFilters,
      setAllFilters,
      removeFilter,
      applyFilters,
      resetFilters,
      setPageInfo,
      setProducts,
      handleSort,
      handleNext,
      handleSetLayout,
    ]
  );

  return <CollectionContext.Provider value={values}>{children}</CollectionContext.Provider>;
}
