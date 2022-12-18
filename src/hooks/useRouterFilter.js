import { useCallback, useEffect, useState } from 'react';
import config from '@/config/index';
import { getFiltersFromQuery } from '@/lib/shopify/helpers';

const { useRouter } = require('next/router');

const useRouterFilter = (filters, pageInfo) => {
  const { query, pathname, push, asPath } = useRouter();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notAppliedFilters, setNotAppliedFilters] = useState([]);
  const [actualFilters, setActualFilters] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, [pageInfo]);

  useEffect(() => {
    if (loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    if (query?.filter) {
      const filteredFilters = getFiltersFromQuery(filters, query);
      if (Array.isArray(filteredFilters)) setSelectedFilters(filteredFilters);
    }
  }, [query, filters]);

  const addFilter = useCallback((filter) => {
    setSelectedFilters((prev) => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((filterId) => {
    setSelectedFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  const isSelectionDifferent = () => {
    if (notAppliedFilters.length) return true;
    if (selectedFilters.length !== actualFilters.length) return true;
    return false;
  };

  const applyFilters = () => {
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
      setLoading(true);
    }

    push(newUrl.href);
  };

  const handlePrev = async () => {
    const newUrl = new URL(config.baseUrl + asPath);
    newUrl.searchParams.set('endCursor', pageInfo.endCursor);
    newUrl.searchParams.set('startCursor', pageInfo.startCursor);
    newUrl.searchParams.set('direction', 'backward');
    setLoading(true);
    push(newUrl);
  };

  const handleNext = async () => {
    const newUrl = new URL(config.baseUrl + asPath);
    newUrl.searchParams.set('endCursor', pageInfo.endCursor);
    newUrl.searchParams.set('startCursor', pageInfo.startCursor);
    newUrl.searchParams.set('direction', 'forward');
    setLoading(true);
    push(newUrl);
  };

  const handleSort = (value) => {
    const newUrl = new URL(config.baseUrl + asPath);
    newUrl.searchParams.set('sort_key', value);
    newUrl.searchParams.delete('direction');
    newUrl.searchParams.delete('startCursor');
    newUrl.searchParams.delete('endCursor');
    push(newUrl);
  };

  const resetFilters = () => {
    const path = pathname.replace('[collectionSlug]', query.collectionSlug);
    const newUrl = new URL(config.baseUrl + path);
    setSelectedFilters([]);
    push(newUrl);
  };

  useEffect(() => {
    const values = getFiltersFromQuery(filters, query);
    setActualFilters(values);
  }, [filters, query]);

  useEffect(() => {
    const result = selectedFilters.filter((obj) =>
      actualFilters.every((s) => s.id !== obj.id)
    );
    setNotAppliedFilters(result);
  }, [actualFilters, filters, query, selectedFilters]);

  return {
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
  };
};

export default useRouterFilter;
