import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import config from '@/config/index';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';
import { useRouter } from 'next/router';
import { CollectionReducer, initialState, actions } from './CollectionReducer';

export const CollectionContext = createContext();

export function CollectionProvider({ children, pageInfo, filters }) {
  const [states, dispatch] = useReducer(CollectionReducer, initialState);
  const { loading, notAppliedFilters, selectedFilters, actualFilters } = states;
  const { query, pathname, push, asPath } = useRouter();

  useEffect(() => {
    dispatch({ type: actions.SET_LOADING, payload: false });
  }, [pageInfo]);

  useEffect(() => {
    if (loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    if (query?.filter) {
      const filteredFilters = getFiltersFromQuery(filters, query);
      if (Array.isArray(filteredFilters)) {
        dispatch({
          type: actions.SET_SELECTED_FILTERS,
          payload: filteredFilters,
        });
      }
    }
  }, [query, filters]);

  const addFilter = useCallback(
    (filter) => {
      const newFilters = [...selectedFilters, filter];
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

  const isSelectionDifferent = useCallback(() => {
    if (notAppliedFilters.length) return true;
    if (selectedFilters.length !== actualFilters.length) return true;
    return false;
  }, [actualFilters.length, notAppliedFilters.length, selectedFilters.length]);

  const applyFilters = useCallback(() => {
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);

    if (query.startCursor) newUrl.searchParams.delete('startCursor');
    if (query.endCursor) newUrl.searchParams.delete('endCursor');
    newUrl.searchParams.delete('backward');

    if (selectedFilters.length > 0) {
      selectedFilters.forEach((item) => {
        newUrl.searchParams.append('filter', item.id);
      });
    } else newUrl.searchParams.delete('filter');

    if (query.sort_key) newUrl.searchParams.set('sort_key', query.sort_key);

    if (isSelectionDifferent()) {
      if (newUrl.pathname === pathname) return;
      dispatch({ type: actions.SET_LOADING, payload: true });
    }

    push(newUrl.href);
  }, [
    isSelectionDifferent,
    pathname,
    push,
    query.collectionSlug,
    query.endCursor,
    query.sort_key,
    query.startCursor,
    selectedFilters,
  ]);

  const handlePrev = useCallback(async () => {
    const newUrl = new URL(config.baseUrl + asPath);
    newUrl.searchParams.set('endCursor', pageInfo.endCursor);
    newUrl.searchParams.set('startCursor', pageInfo.startCursor);
    newUrl.searchParams.set('direction', 'backward');
    dispatch({ type: actions.SET_LOADING, payload: true });
    push(newUrl);
  }, [asPath, pageInfo.endCursor, pageInfo.startCursor, push]);

  const handleNext = useCallback(async () => {
    const newUrl = new URL(config.baseUrl + asPath);
    newUrl.searchParams.set('endCursor', pageInfo.endCursor);
    newUrl.searchParams.set('startCursor', pageInfo.startCursor);
    newUrl.searchParams.set('direction', 'forward');
    dispatch({ type: actions.SET_LOADING, payload: true });
    push(newUrl);
  }, [asPath, pageInfo.endCursor, pageInfo.startCursor, push]);

  const handleSort = useCallback(
    (value) => {
      const newUrl = new URL(config.baseUrl + asPath);
      newUrl.searchParams.set('sort_key', value);
      newUrl.searchParams.delete('direction');
      newUrl.searchParams.delete('startCursor');
      newUrl.searchParams.delete('endCursor');
      push(newUrl);
    },
    [asPath, push]
  );

  const resetFilters = useCallback(() => {
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);
    dispatch({ type: actions.SET_SELECTED_FILTERS, payload: [] });
    push(newUrl);
  }, [pathname, push, query.collectionSlug]);

  useEffect(() => {
    const values = getFiltersFromQuery(filters, query);
    dispatch({ type: actions.SET_ACTUAL_FILTERS, payload: values });
  }, [filters, query]);

  useEffect(() => {
    const result = selectedFilters.filter((obj) =>
      actualFilters.every((s) => s.id !== obj.id)
    );
    dispatch({ type: actions.SET_NOT_APPLIED_FILTERS, payload: result });
  }, [actualFilters, filters, query, selectedFilters]);

  const values = useMemo(
    () => ({
      selectedFilters,
      loading,
      notAppliedFilters,
      actualFilters,
      handleSort,
      addFilter,
      removeFilter,
      applyFilters,
      handleNext,
      handlePrev,
      resetFilters,
      isSelectionDifferent,
      pageInfo,
      filters,
    }),
    [
      selectedFilters,
      loading,
      notAppliedFilters,
      actualFilters,
      handleSort,
      addFilter,
      removeFilter,
      applyFilters,
      handleNext,
      handlePrev,
      resetFilters,
      isSelectionDifferent,
      pageInfo,
      filters,
    ]
  );

  return (
    <CollectionContext.Provider value={values}>
      {children}
    </CollectionContext.Provider>
  );
}
