'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Search } from 'lucide-react';

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
      <Search className="text-muted-foreground" />
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
  const [, action] = useActionState(searchAction, {
    searchQuery: '',
  });

  return (
    <form action={action} className="relative w-full max-w-2xl mx-auto">
      <Label aria-label="Search" className="flex items-center">
        <Input
          className="py-7 pl-8 pr-11"
          type="text"
          name="searchQuery"
          defaultValue={searchQuery}
          placeholder="Search"
          aria-label="Search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={onChange}
        />
      </Label>
      <SubmitButton />
    </form>
  );
};

export default SearchForm;
