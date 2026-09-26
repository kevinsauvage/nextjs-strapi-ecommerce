'use client';

import Form from 'next/form';
import { useTranslations } from 'next-intl';

import { Input } from './ui/input';
import { Label } from './ui/label';

import { Search } from 'lucide-react';

/**
 * GET navigation via `next/form` (prefetch + no server action): submitting
 * sends the `searchQuery` field to `/search?searchQuery=…`, which is exactly
 * the shape `src/app/search/page.tsx` reads. Live suggestions still flow
 * through the controlled `onChange` in `Search.tsx`.
 */
const SearchForm = ({
  value,
  onChange,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  const t = useTranslations('shared');
  const label = t('search');

  return (
    <Form action="/search" className="relative w-full max-w-2xl mx-auto">
      <Label aria-label={label} className="flex items-center">
        <Input
          className="py-7 pl-8 pr-11"
          type="text"
          name="searchQuery"
          placeholder={label}
          aria-label={label}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={onChange}
          value={value}
        />
      </Label>
      <button
        type="submit"
        aria-label={label}
        className="group absolute right-3 top-1/2 -translate-y-1/2"
      >
        <Search className="text-secondary group-hover:text-primary transition-colors" />
      </button>
    </Form>
  );
};

export default SearchForm;
