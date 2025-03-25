import Link from 'next/link';

import styles from './ActiveLink.module.scss';

const ActiveLink = ({ children, url, as, scroll = true, isActive, activeStyle, ...rest }) => {
  const path = url.includes('http') ? new URL(url)?.pathname : url;

  return (
    <Link
      {...rest}
      href={path.toLowerCase()}
      as={as}
      scroll={scroll}
      className={`${styles.link}  ${isActive && activeStyle}`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
