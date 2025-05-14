'use server';
import { redirect } from 'next/navigation';

import { storefrontSdk } from '@/shopify';

// eslint-disable-next-line @typescript-eslint/require-await
export const searchAction = async (previousState: unknown, data: FormData) => {
  const searchQuery = data.get('searchQuery') as string;

  if (!searchQuery) {
    return;
  }

  const searchQueryString = searchQuery.toString().trim();

  redirect(`/search?searchQuery=${searchQueryString}`);
};

export const predictiveSearchAction = async (previousState: unknown, data: FormData) => {
  const searchQuery = data.get('searchQuery') as string;

  if (!searchQuery) {
    return;
  }

  const searchQueryString = searchQuery.toString().trim();

  return await storefrontSdk().predictiveSearch({
    query: searchQueryString,
  });
};
