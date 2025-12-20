'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import { Search } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { searchAction } from '@/actions/SearchAction';

import { Input } from './ui/input';

const SubmitButton = ({ ...properties }: React.ComponentProps<'button'>) => {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      disabled={status.pending}
      className="absolute right-3 top-1/2 -translate-y-1/2"
      {...properties}
    >
      <Search className="text-secondary" />
    </button>
  );
};

const SearchForm = ({
  searchQuery,
  onChange,
}: {
  searchQuery: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  const [value, setValue] = useState(searchQuery || '');
  const [, action] = useActionState(() => searchAction(value), searchQuery);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event);
  };

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  return (
    <form action={action} className="relative w-full max-w-2xl mx-auto">
      <Label aria-label="Search" className="flex items-center">
        <Input
          className="py-7 pl-8 pr-11"
          type="text"
          name="searchQuery"
          placeholder="Search"
          aria-label="Search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={handleChange}
          value={value}
        />
      </Label>
      <SubmitButton />
    </form>
  );
};

export default SearchForm;
