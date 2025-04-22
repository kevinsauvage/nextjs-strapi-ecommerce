import type { ProductFilter } from './storefront';

interface PaginationVariables {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  [key: string]: unknown; // To allow any other additional properties
}

export const adjustPaginationVariables = ({
  after,
  before,
  first,
  ...rest
}: PaginationVariables): PaginationVariables => {
  const variables: PaginationVariables = {
    ...rest,
    after: after || undefined, // Cursor for next page
    before: before || undefined, // Cursor for previous page
    first: after ? first || 10 : undefined, // Forward pagination
    last: before ? first || 10 : undefined, // Backward pagination
  };

  if (!after && !before) {
    variables.first = first || 10; // Default to forward pagination
  }

  return variables;
};

export const parseFiltersQuery = (filters: string | Array<string> | undefined): ProductFilter[] => {
  if (!filters) return [];

  if (!Array.isArray(filters) && typeof filters === 'string') {
    const [, jsonPart] = filters.split(/:(.+)/);
    return [JSON.parse(jsonPart) as ProductFilter];
  }

  return filters
    .map((item): ProductFilter | undefined => {
      const [, jsonPart] = item.split(/:(.+)/);
      if (!jsonPart) return undefined;
      return JSON.parse(jsonPart) as ProductFilter;
    })
    .filter((filter): filter is ProductFilter => filter !== undefined);
};
