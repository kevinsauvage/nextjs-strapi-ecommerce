import Link from 'next/link';
import { withRouter } from 'next/router';
import { Children, cloneElement } from 'react';

export default withRouter(
  ({
    router,
    children,
    as,
    url,
    scroll = true,
    className,
    activeClass,
    ...rest
  }) => {
    const path = url.includes('http') ? new URL(url)?.pathname : url;

    console.log(path, 'path');
    console.log(router.asPath);
    return (
      <Link {...rest} href={path} as={as} scroll={scroll}>
        {cloneElement(Children.only(children), {
          className: `${className || ''} ${
            router.asPath === path ? activeClass || 'active' : null
          }`,
        })}
      </Link>
    );
  }
);
