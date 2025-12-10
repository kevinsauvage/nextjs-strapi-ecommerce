'use server';

import { redirect } from 'next/navigation';

export const searchAction = async (searchQuery: string) => {
  redirect(`/search?searchQuery=${searchQuery}`);
};
