'use client';

import { useState } from 'react';

import { predictiveSearchAction } from '@/actions/SearchAction';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import type { PredictiveSearchQuery } from '@/shopify/storefront';
import debounce from '@/utils/debounce';

const Search = ({ searchQuery }: { searchQuery: string }) => {
  const [results, setResults] = useState<PredictiveSearchQuery['predictiveSearch'] | null>(null);

  const handleChange = async (value: string) => {
    if (value?.trim().length < 2) {
      setResults(null);
      return;
    }

    const formData = new FormData();
    formData.append('searchQuery', value);

    const response = await predictiveSearchAction(null, formData);

    setResults(response?.predictiveSearch || null);
  };

  const debouncedHandleChange = debounce((value: string) => {
    handleChange(value).catch((error) => {
      console.error('Error fetching search results:', error);
    });
  }, 500);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <SearchForm
        searchQuery={searchQuery}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          debouncedHandleChange(event.target.value)
        }
      />

      {results && <SearchResults results={results} />}
    </div>
  );
};

export default Search;
