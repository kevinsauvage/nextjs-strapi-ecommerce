import Link from 'next/link';
import { withRouter } from 'next/router';

import styles from './ActiveLink.module.scss';

export default withRouter(({ router, children, as, url, scroll = true, isActive, activeStyle, ...rest }) => {
  const path = url.includes('http') ? new URL(url)?.pathname : url;

  return (
    <Link
      {...rest}
      href={path.toLowerCase()}
      as={as}
      scroll={scroll}
      className={`${styles.ActiveLink}  ${
        (router.asPath === path?.toLowerCase() || isActive) && activeStyle
      }`}
    >
      {children}
    </Link>
  );
});
