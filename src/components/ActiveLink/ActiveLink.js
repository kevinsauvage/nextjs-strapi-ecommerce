import Link from 'next/link';
import { withRouter } from 'next/router';
import { Children, cloneElement } from 'react';

export default withRouter(
  ({ router, children, as, url, className, activeClass, ...rest }) => {
    const path = new URL(url)?.pathname;

    return (
      <Link {...rest} href={path} as={as}>
        {cloneElement(Children.only(children), {
          className: `${className || ''} ${
            router.asPath === path ? activeClass || 'active' : null
          }`,
        })}
      </Link>
    );
  }
);
