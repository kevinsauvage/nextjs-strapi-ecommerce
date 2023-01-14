import Link from 'next/link';
import { withRouter } from 'next/router';
import styles from './ActiveLink.module.scss';

export default withRouter(
  ({ router, children, as, url, scroll = true, ...rest }) => {
    const path = url.includes('http') ? new URL(url)?.pathname : url;

    return (
      <Link
        {...rest}
        href={path}
        as={as}
        scroll={scroll}
        className={`${styles.ActiveLink}  ${
          (router.asPath === path || router.pathname === path) && styles.active
        }`}
      >
        {children}
      </Link>
    );
  }
);
