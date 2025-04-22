import Link from 'next/link';

import styles from './ActiveLink.module.scss';

const ActiveLink = ({
  children,
  url,
  scroll = true,
  isActive,
  activeStyle,
  ...rest
}: {
  children: React.ReactNode;
  url: string;
  scroll?: boolean;
  isActive?: boolean;
  activeStyle?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    as?: string;
    replace?: boolean;
    shallow?: boolean;
    prefetch?: boolean;
    legacyBehavior?: boolean;
  }) => {
  const path = url.includes('http') ? new URL(url)?.pathname : url;

  return (
    <Link
      {...rest}
      href={path.toLowerCase()}
      scroll={scroll}
      className={`${styles.link}  ${isActive && activeStyle}`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
