const { useRouter } = require('next/router');

const useRouterFilter = () => {
  const { pathname, query, push } = useRouter();

  const pushQuery = (q, scroll) => {
    push(
      {
        pathname,
        query: q,
      },
      undefined,
      { scroll }
    );
  };

  const addParam = (name, value, scroll, changePage) => {
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

    if (changePage) newQuery.page = 1;
    pushQuery({ ...rest, ...newQuery }, scroll);
  };

  const addUniqueParam = (name, value) => {
    const { [name]: param, ...rest } = query;
    pushQuery({ ...rest, [name]: value });
  };

  return {
    addParam,
    pushQuery,
    addUniqueParam,
  };
};

export default useRouterFilter;
