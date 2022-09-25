const { useRouter } = require('next/router');

const useRouterFilter = () => {
  const { pathname, query, push } = useRouter();

  const addParam = (name, value, scroll, changePage) => {
    const { [name]: param, ...rest } = query;
    let newQuery = {};

    if (!param) {
      newQuery = { ...rest, [name]: value };
    } else if (Array.isArray(param)) {
      if (param.indexOf(value) > -1) {
        newQuery = {
          ...rest,
          [name]: param.filter((p) => p !== JSON.stringify(JSON.parse(value))),
        };
      } else {
        newQuery = { ...rest, [name]: [...param, value] };
      }
    } else if (param !== value) {
      newQuery = { ...rest };
    } else {
      newQuery = { ...rest, [name]: [param, value] };
    }

    if (changePage) newQuery.page = 1;

    push(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { scroll }
    );
  };

  return {
    addParam,
  };
};

export default useRouterFilter;
