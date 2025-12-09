'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { storefrontSdk } from '@/shopify';

export const searchAction = (previousState: unknown, data: FormData) => {
  const searchQuery = data.get('searchQuery') as string;

  const searchQueryString = searchQuery?.toString().trim();

  redirect(`/search?searchQuery=${searchQueryString}`);
};

export const predictiveSearchAction = async (previousState: unknown, data: FormData) => {
  const searchQuery = data.get('searchQuery') as string;

  if (!searchQuery) {
    return;
  }

  const searchQueryString = searchQuery.toString().trim();

  const response = await storefrontSdk().predictiveSearch({
    query: searchQueryString,
  });

  if (!response) {
    return;
  }
  revalidatePath('/search');
  return response;
};
