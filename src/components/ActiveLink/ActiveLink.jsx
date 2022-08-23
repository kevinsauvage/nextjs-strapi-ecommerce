import Link from 'next/link';
import { withRouter } from 'next/router';
import { Children, cloneElement } from 'react';

export default withRouter(
  ({ router, children, as, href, activeClass, ...rest }) => (
    <Link {...rest} href={href} as={as}>
      {cloneElement(Children.only(children), {
        className:
          router.asPath === href || router.asPath === as
            ? activeClass || 'active'
            : null,
      })}
    </Link>
  )
);
