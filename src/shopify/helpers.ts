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
