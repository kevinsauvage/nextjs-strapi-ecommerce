const { useRouter } = require('next/router');

const useRouterFilter = () => {
  const { pathname, query, push } = useRouter();

  const addParam = (name, value, scroll, changePage) => {
    const { [name]: param, ...rest } = query;
    let newQuery = {};

    if (!param) newQuery = { [name]: value };
    else if (Array.isArray(param)) {
      if (param.indexOf(value) > -1) {
        newQuery = {
          [name]: param.filter((p) => p !== JSON.stringify(JSON.parse(value))),
        };
      } else newQuery = { [name]: [...param, value] };
    } else if (param !== value) newQuery = { [name]: [param, value] };

    if (changePage) newQuery.page = 1;

    push(
      {
        pathname,
        query: { ...rest, ...newQuery },
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
