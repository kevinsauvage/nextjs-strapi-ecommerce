import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
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

  // Check if there is new filters to apply
  const isSelectionDifferent = useCallback(() => {
    if (notAppliedFilters.length) return true;
    if (selectedFilters.length !== actualFilters.length) return true;

    return false;
  }, [actualFilters.length, notAppliedFilters.length, selectedFilters.length]);

  const setPageInfo = useCallback((payload) => {
    dispatch({
      type: actions.SET_PAGE_INFO,
      payload,
    });
  }, []);

  const setProducts = useCallback((payload) => {
    dispatch({
      type: actions.SET_PRODUCTS,
      payload,
    });
  }, []);

  const setAllFilters = useCallback((payload) => {
    dispatch({
      type: actions.SET_ALL_FILTERS,
      payload,
    });
  }, []);

  const setSelectedFilters = useCallback(
    (payload) => {
      const newFilters = [...selectedFilters, payload];
      dispatch({
        type: actions.SET_SELECTED_FILTERS,
        payload: newFilters,
      });
    },
    [selectedFilters]
  );

  const removeFilter = useCallback(
    (filterId) => {
      const newFilters = selectedFilters.filter((f) => f.id !== filterId);
      dispatch({
        type: actions.SET_SELECTED_FILTERS,
        payload: newFilters,
      });
    },
    [selectedFilters]
  );

  const resetFilters = useCallback(async () => {
    toggleFilter(false);

    dispatch({ type: actions.SET_LOADING, payload: true });

    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);

    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
    push(newUrl, undefined, { shallow: true });

    const data = await filterCollectionForward(
      query.collectionSlug,
      10,
      [],
      query.sort_key,
      null
    );

    dispatch({ type: actions.SET_LOADING, payload: false });

    if (data) {
      const newProducts = data?.collection?.products;
      const newPageInfo = data?.pageInfo;
      if (newProducts) setProducts(newProducts);
      if (newPageInfo) setPageInfo(newPageInfo);
      window.scrollTo(0, 0);
    }
    return null;
  }, [
    pathname,
    push,
    query.collectionSlug,
    query.sort_key,
    setPageInfo,
    setProducts,
    toggleFilter,
  ]);

  const applyFilters = useCallback(async () => {
    toggleFilter(false);
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);

    if (selectedFilters.length > 0) {
      selectedFilters.forEach((item) => {
        newUrl.searchParams.append('filter', item.id);
      });
    } else newUrl.searchParams.delete('filter');

    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);

    if (isSelectionDifferent()) {
      if (newUrl.href === href) return;
    }
    push(newUrl, undefined, { shallow: true });

    dispatch({ type: actions.SET_LOADING, payload: true });

    const filters = selectedFilters.map((item) => JSON.parse(item.input));

    const data = await filterCollectionForward(
      query.collectionSlug || 'all',
      10,
      filters,
      query.sort_key,
      null
    );

    dispatch({ type: actions.SET_LOADING, payload: false });

    if (data) {
      const newProducts = data?.collection?.products;
      const newPageInfo = data?.pageInfo;
      if (newProducts) setProducts(newProducts);
      if (newPageInfo) setPageInfo(newPageInfo);
      window.scrollTo(0, 0);
    }
  }, [
    href,
    isSelectionDifferent,
    pathname,
    push,
    query.collectionSlug,
    query.sort_key,
    selectedFilters,
    setPageInfo,
    setProducts,
    toggleFilter,
  ]);

  const handleSort = useCallback(
    async (value) => {
      if (!value) return null;
      const newUrl = new URL(config.baseUrl + asPath);
      newUrl.searchParams.set('sort_key', value);
      dispatch({ type: actions.SET_LOADING, payload: true });

      const filters = actualFilters.map((filter) => JSON.parse(filter.input));

      const data = await filterCollectionForward(
        query.collectionSlug || 'all',
        10,
        filters,
        value,
        null
      );

      dispatch({ type: actions.SET_LOADING, payload: false });

      if (data) {
        const newProducts = data?.collection?.products;
        const newPageInfo = data?.pageInfo;
        if (newProducts) setProducts(newProducts);
        if (newPageInfo) setPageInfo(newPageInfo);
        window.scrollTo(0, 0);
        return push(newUrl, undefined, { shallow: true });
      }
      return null;
    },
    [
      actualFilters,
      asPath,
      push,
      query.collectionSlug,
      setPageInfo,
      setProducts,
    ]
  );

  const handleSetLayout = useCallback((newLayout) => {
    dispatch({ type: actions.SET_LAYOUT, payload: newLayout });
  }, []);

  // PAGINATION ==============================================================================================

  /* A function that is called when the user clicks on the next button. */
  const handleNext = useCallback(async () => {
    dispatch({ type: actions.SET_LOADING, payload: true });

    const filteredFilters = getFiltersFromQuery(allFilters, query);
    const filters = filteredFilters.map((item) => JSON.parse(item.input));

    const data = await filterCollectionForward(
      query.collectionSlug || 'all',
      10,
      filters,
      query.sort_key,
      pageInfo.endCursor
    );

    dispatch({ type: actions.SET_LOADING, payload: false });

    if (data) {
      const newProducts = data?.collection?.products;
      const newPageInfo = data?.pageInfo;
      if (newProducts) setProducts([...products, ...newProducts]);
      if (newPageInfo) setPageInfo(newPageInfo);
    }
  }, [
    allFilters,
    pageInfo.endCursor,
    products,
    query,
    setPageInfo,
    setProducts,
  ]);

  // EFFECTS ==================================================================================================

  // Reset filters if collection change
  useEffect(() => {
    dispatch({
      type: actions.SET_SELECTED_FILTERS,
      payload: [],
    });
  }, [query.collectionSlug]);

  // Get filter from query and set it in selected filters
  useEffect(() => {
    if (query?.filter) {
      const filteredFilters = getFiltersFromQuery(allFilters, query);
      if (Array.isArray(filteredFilters)) {
        dispatch({
          type: actions.SET_SELECTED_FILTERS,
          payload: filteredFilters,
        });
      }
    }
  }, [query, allFilters]);

  useEffect(() => {
    const values = getFiltersFromQuery(allFilters, query);

    dispatch({ type: actions.SET_ACTUAL_FILTERS, payload: values });
  }, [allFilters, query]);

  useEffect(() => {
    const result = selectedFilters.filter((obj) =>
      actualFilters.every((s) => s.id !== obj.id)
    );

    dispatch({ type: actions.SET_NOT_APPLIED_FILTERS, payload: result });
  }, [actualFilters, selectedFilters]);

  const values = useMemo(
    () => ({
      notAppliedFilters,
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
      notAppliedFilters,
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

  return (
    <CollectionContext.Provider value={values}>
      {children}
    </CollectionContext.Provider>
  );
}
