'use client';

import dynamic from 'next/dynamic';
import type { RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { predictiveSearchAction } from '@/actions/SearchAction';
import SearchForm from '@/components/SearchForm';
import useOnClickOutside from '@/hooks/useClickOutside';
import type { PredictiveSearchQuery } from '@/shopify/storefront';
import debounce from '@/utils/debounce';

const SearchResults = dynamic(() => import('@/components/SearchResults'));

const Search = ({ searchQuery }: { searchQuery: string }) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [results, setResults] = useState<PredictiveSearchQuery['predictiveSearch'] | null>(null);
  const reference = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(reference as RefObject<HTMLElement>, () => setResults(null));

  const handleChange = useCallback(async (value: string) => {
    if (value?.trim().length < 2) {
      setResults(null);
      return;
    }

    const formData = new FormData();
    formData.append('searchQuery', value);

    const response = await predictiveSearchAction(null, formData);

    setResults(response?.predictiveSearch || null);
  }, []);

  const debouncedHandleChange = useMemo(
    () =>
      debounce((value: unknown) => {
        if (typeof value !== 'string') return;
        void handleChange(value);
      }, 500),
    [handleChange],
  );

  useEffect(() => {
    return () => debouncedHandleChange.cancel();
  }, [debouncedHandleChange]);

  useEffect(() => {
    setResults(null);
    setSearchValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={reference}>
      <SearchForm
        searchQuery={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
          debouncedHandleChange(event.target.value);
        }}
      />

      {results && <SearchResults results={results} />}
    </div>
  );
};

export default Search;
