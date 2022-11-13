import { useCallback, useState } from 'react';

const { useRouter } = require('next/router');

const useRouterFilter = () => {
  const { query, pathname, push } = useRouter();
  const [selectedFilters, setSelectedFilters] = useState(undefined);

  const addParam = (name, value) => {
    const { [name]: param, ...rest } = query;
    let newQuery = {};

    if (!param) newQuery = { [name]: value };
    else if (Array.isArray(param)) {
      if (param.indexOf(value) > -1) {
        newQuery = {
          [name]: param.filter((p) => p !== value),
        };
      } else newQuery = { [name]: [...param, value] };
    } else if (param !== value) newQuery = { [name]: [param, value] };

    setSelectedFilters((prev) => ({ ...prev, ...newQuery }));
    push({ pathname, query: { ...rest, ...newQuery } }, undefined, {
      shallow: true,
    });
  };

  const addUniqueParam = useCallback(
    (name, value) => {
      setSelectedFilters((prev) => ({ ...prev, [name]: value }));
      push({ pathname, query: { ...query, [name]: value } }, undefined, {
        shallow: true,
      });
    },
    [query, push, pathname]
  );

  return {
    addParam,
    addUniqueParam,
    selectedFilters,
  };
};

export default useRouterFilter;
