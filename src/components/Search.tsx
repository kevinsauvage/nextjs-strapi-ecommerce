'use client';

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { predictiveSearchAction } from '@/actions/SearchAction';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import useOnClickOutside from '@/hooks/useClickOutside';
import type { PredictiveSearchQuery } from '@/shopify/storefront';
import debounce from '@/utils/debounce';

const Search = ({ searchQuery }: { searchQuery: string }) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [results, setResults] = useState<PredictiveSearchQuery['predictiveSearch'] | null>(null);
  const reference = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(reference as RefObject<HTMLElement>, () => setResults(null));

  const handleChange = async (value: string) => {
    setSearchValue(value);
    if (value?.trim().length < 2) {
      setResults(null);
      return;
    }

    const formData = new FormData();
    formData.append('searchQuery', value);

    const response = await predictiveSearchAction(null, formData);

    setResults(response?.predictiveSearch || null);
  };

  const debouncedHandleChange = debounce((value: unknown) => {
    if (typeof value !== 'string') return;
    void handleChange(value);
  }, 500);

  useEffect(() => {
    setResults(null);
    setSearchValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={reference}>
      <SearchForm
        searchQuery={searchValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          debouncedHandleChange(event.target.value)
        }
      />

      {results && <SearchResults results={results} />}
    </div>
  );
};

export default Search;
