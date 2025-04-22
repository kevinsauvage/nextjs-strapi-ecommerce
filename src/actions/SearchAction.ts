'use server';

import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/require-await
export const searchAction = async (previousState: unknown, data: FormData) => {
  const searchQuery = data.get('searchQuery') as string;

  if (!searchQuery) {
    return;
  }

  const searchQueryString = searchQuery.toString().trim();

  redirect(`/search?searchQuery=${searchQueryString}`);
};
