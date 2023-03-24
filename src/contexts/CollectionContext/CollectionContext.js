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
  const {
    loading,
    selectedFilters,
    pageInfo,
    products,
    allFilters,
    layout,
    collectionNav,
    collection,
  } = states;
  const { query, push, to, asPath } = useRouter();

  const getFormattedFilter = useCallback(
    () => selectedFilters.map((item) => JSON.parse(item.input)),
    [selectedFilters]
  );

  const handleGetData = useCallback(
    async (first, filters, sort, after) => {
      dispatch({ payload: true, type: actions.SET_LOADING });
      const data = await getClient().storefront.collection.collection({
        after,
        filters,
        first,
        handle: query.collectionSlug,
        sort,
      });

      dispatch({ payload: false, type: actions.SET_LOADING });
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

      if (newPageInfo) dispatch({ payload: newPageInfo, type: actions.SET_PAGE_INFO });
      if (newProducts) {
        dispatch({
          payload: concat ? [...products, ...newProducts] : newProducts,
          type: actions.SET_PRODUCTS,
        });
      }
    },
    [products]
  );

  const resetFilters = useCallback(async () => {
    dispatch({ payload: [], type: actions.SET_PRODUCTS });

    const newQuery = query.sort_key ? { sort_key: query.sort_key } : {};
    push({ pathname: asPath.split('?')[0], query: newQuery }, undefined, { shallow: true });
    const data = await handleGetData(15, [], query.sort_key);
    dispatch({ payload: [], type: actions.SET_SELECTED_FILTERS });
    handleSetFilterState(data);
  }, [asPath, handleGetData, handleSetFilterState, push, query]);

  const applyFilters = useCallback(async () => {
    const newUrl = new URL(config.baseUrl + asPath.split('?')[0]);
    if (selectedFilters.length > 0) {
      selectedFilters.forEach((item) => newUrl.searchParams.append(item.filterId, item.input));
    }
    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);

    push(newUrl, undefined, { shallow: true });
    const filters = getFormattedFilter();
    dispatch({ payload: [], type: actions.SET_PRODUCTS });
    const data = await handleGetData(15, filters, query.sort_key);
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
      if (!value) return;
      dispatch({ payload: [], type: actions.SET_PRODUCTS });
      push({ pathname: to, query: { ...query, sort_key: value } }, undefined, { shallow: true });
      const filters = getFormattedFilter();
      const data = await handleGetData(30, filters, value);
      handleSetFilterState(data);
    },
    [getFormattedFilter, handleGetData, handleSetFilterState, push, query, to]
  );

  const handleNext = useCallback(async () => {
    const filters = getFormattedFilter();
    const data = await handleGetData(30, filters, query.sort_key, pageInfo?.endCursor);
    handleSetFilterState(data, true);
  }, [
    getFormattedFilter,
    handleGetData,
    handleSetFilterState,
    pageInfo?.endCursor,
    query.sort_key,
  ]);

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
          payload: newFilters,
          type: actions.SET_SELECTED_FILTERS,
        });
      } else {
        dispatch({
          payload: [...selectedFilters, { filterId, input }],
          type: actions.SET_SELECTED_FILTERS,
        });
      }
    },
    [isSelected, selectedFilters]
  );

  const handleSetUniqueFilters = useCallback(
    async (filterId, input) => {
      const newFilters = selectedFilters.filter((filter) => filter.filterId !== filterId);

      dispatch({
        payload: [...newFilters, { filterId, input }],
        type: actions.SET_SELECTED_FILTERS,
      });
    },
    [selectedFilters]
  );

  useEffect(() => {
    if (initialProducts && !products)
      dispatch({ payload: initialProducts, type: actions.SET_PRODUCTS });
    if (initialPageInfo && !pageInfo)
      dispatch({ payload: initialPageInfo, type: actions.SET_PAGE_INFO });
    if (collectionFilters && !allFilters)
      dispatch({ payload: collectionFilters, type: actions.SET_ALL_FILTERS });
    if (initialCollection && !collection?.id)
      dispatch({ payload: initialCollection, type: actions.SET_COLLECTION });
    if (menu && !collectionNav)
      dispatch({ payload: menu, type: actions.SET_COLLECTION_NAVIGATION });
  }, [
    initialCollection,
    collectionFilters,
    initialPageInfo,
    initialProducts,
    menu,
    push,
    products,
    pageInfo,
    collection?.id,
    collectionNav,
    allFilters,
  ]);

  useEffect(() => {
    dispatch({ payload: [], type: actions.SET_SELECTED_FILTERS });

    console.log(
      '🚀 ~ file: CollectionContext.js:203 ~ useEffect ~   dispatch({ payload: [], type: actions.SET_SELECTED_FILTERS });:'
    );
  }, [query.collectionSlug]);

  useEffect(() => {
    const filteredFilters = getSelectedFilter(allFilters, query);
    dispatch({ payload: filteredFilters, type: actions.SET_SELECTED_FILTERS });

    console.log(
      '🚀 ~ file: CollectionContext.js:212 ~ useEffect ~   dispatch({ payload: filteredFilters, type: actions.SET_SELECTED_FILTERS });:'
    );
  }, [allFilters, query]);

  const values = useMemo(
    () => ({
      allFilters,
      applyFilters,
      collection,
      collectionNav,
      dispatch,
      getFormattedFilter,
      handleNext,
      handleSetFilters,
      handleSetUniqueFilters,
      handleSort,
      isSelected,
      isSelectionDifferent,
      layout,
      loading,
      pageInfo,
      products,
      resetFilters,
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
