'use server';

import { redirect } from 'next/navigation';

export async function searchAction(previousState, data) {
  const searchQuery = data.get('searchQuery');

  if (!searchQuery) {
    return;
  }

  redirect(`/search?searchQuery=${searchQuery}`);
}
