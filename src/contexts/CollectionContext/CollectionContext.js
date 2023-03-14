import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import config from '@/config/index';
import { numberOfDifferences } from '@/helpers/array';
import { getSelectedFilter } from '@/helpers/index';
import getClient from '@/shopify/index';

import { actions, CollectionReducer, initialState } from './CollectionReducer';

export const CollectionContext = createContext();

export const CollectionProvider = ({
  children,
  collection: initialCollection,
  pageInfo: initialPageInfo,
  collectionFilters,
  menu,
}) => {
  const { products: initialProducts } = initialCollection || {};
  const [states, dispatch] = useReducer(CollectionReducer, initialState);
  const { loading, selectedFilters, pageInfo, products, allFilters, layout, collectionNav, collection } =
    states;
  const { query, push, to, asPath } = useRouter();

  const getFormattedFilter = useCallback(
    () => selectedFilters.map((item) => JSON.parse(item.input)),
    [selectedFilters]
  );

  const handleGetData = useCallback(
    async (first, filters, sort, after = null) => {
      dispatch({ type: actions.SET_LOADING, payload: true });
      const data = await getClient().storefront.collection.collection({
        handle: query.collectionSlug,
        filters,
        first,
        after,
        sort,
      });

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
    },
    [products]
  );

  const resetFilters = useCallback(async () => {
    dispatch({ type: actions.SET_PRODUCTS, payload: [] });

    const newQuery = query.sort_key ? { sort_key: query.sort_key } : {};
    push({ pathname: asPath.split('?')[0], query: newQuery }, undefined, { shallow: true });
    const data = await handleGetData(15, [], query.sort_key, null);
    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
    handleSetFilterState(data);
  }, [asPath, handleGetData, handleSetFilterState, push, query]);

  const applyFilters = useCallback(async () => {
    dispatch({ type: actions.SET_PRODUCTS, payload: [] });
    const newUrl = new URL(config.baseUrl + asPath.split('?')[0]);
    if (selectedFilters.length > 0) {
      selectedFilters.forEach((item) => newUrl.searchParams.append(item.filterId, item.input));
    }
    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);

    push(newUrl, undefined, { shallow: true });
    const filters = getFormattedFilter();
    const data = await handleGetData(15, filters, query.sort_key, null);
    handleSetFilterState(data);
  }, [
    asPath,
    getFormattedFilter,
    handleGetData,
    handleSetFilterState,
    push,
    query.sort_key,
    selectedFilters,
  ]);

  const handleSort = useCallback(
    async (value) => {
      if (!value) return null;
      dispatch({ type: actions.SET_PRODUCTS, payload: [] });
      push({ pathname: to, query: { ...query, sort_key: value } }, undefined, { shallow: true });
      const filters = getFormattedFilter();
      const data = await handleGetData(30, filters, value, null);
      return handleSetFilterState(data);
    },
    [getFormattedFilter, handleGetData, handleSetFilterState, push, query, to]
  );

  const handleNext = useCallback(async () => {
    const filters = getFormattedFilter();
    const data = await handleGetData(30, filters, query.sort_key, pageInfo.endCursor);
    handleSetFilterState(data, true);
  }, [getFormattedFilter, handleGetData, handleSetFilterState, pageInfo.endCursor, query.sort_key]);

  const isSelectionDifferent = useCallback(() => {
    const filteredFilters = getSelectedFilter(allFilters, query);
    return numberOfDifferences(filteredFilters, selectedFilters);
  }, [allFilters, query, selectedFilters]);

  const isSelected = useCallback(
    (filterId, input) =>
      selectedFilters?.some((filter) => filter.input === input && filter.filterId === filterId),
    [selectedFilters]
  );

  const handleSetFilters = useCallback(
    (filterId, input) => {
      if (isSelected(filterId, input)) {
        const newFilters = selectedFilters.filter((filter) => {
          if (filter.filterId !== filterId) return true;
          return filter.input !== input;
        });

        dispatch({
          type: actions.SET_SELECTED_FILTERS,
          payload: newFilters,
        });
      } else {
        dispatch({
          type: actions.SET_SELECTED_FILTERS,
          payload: [...selectedFilters, { filterId, input }],
        });
      }
    },
    [isSelected, selectedFilters]
  );

  const handleSetUniqueFilters = useCallback(
    async (filterId, input) => {
      const newFilters = selectedFilters.filter((filter) => filter.filterId !== filterId);

      dispatch({
        type: actions.SET_SELECTED_FILTERS,
        payload: [...newFilters, { filterId, input }],
      });
    },
    [selectedFilters]
  );

  useEffect(() => {
    if (initialProducts) dispatch({ type: actions.SET_PRODUCTS, payload: initialProducts });
    if (initialPageInfo) dispatch({ type: actions.SET_PAGE_INFO, payload: initialPageInfo });
    if (collectionFilters) dispatch({ type: actions.SET_ALL_FILTERS, payload: collectionFilters });
    if (initialCollection) dispatch({ type: actions.SET_COLLECTION, payload: initialCollection });
  }, [initialCollection, collectionFilters, initialPageInfo, initialProducts]);

  useEffect(() => {
    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
  }, [query.collectionSlug]);

  useEffect(() => {
    const filteredFilters = getSelectedFilter(allFilters, query);
    if (Array.isArray(filteredFilters)) {
      dispatch({ type: actions.SET_SELECTED_FILTERS, payload: filteredFilters });
    }
  }, [allFilters, query]);

  useEffect(() => {
    if (menu) {
      dispatch({ type: actions.SET_COLLECTION_NAVIGATION, payload: menu });
    } else push('/');
  }, [menu, push]);

  const values = useMemo(
    () => ({
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
      collectionNav,
      isSelected,
      handleSetFilters,
      handleSetUniqueFilters,
      collection,
      getFormattedFilter,
    }),
    [
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
      collectionNav,
      isSelected,
      handleSetFilters,
      handleSetUniqueFilters,
      collection,
      getFormattedFilter,
    ]
  );

  return <CollectionContext.Provider value={values}>{children}</CollectionContext.Provider>;
};
