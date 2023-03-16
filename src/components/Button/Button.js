/* eslint-disable react/button-has-type */
import Link from 'next/link';

import styles from './Button.module.scss';

const Button = ({
  children,
  type,
  onClick,
  text,
  extraClass,
  primary,
  secondary,
  contrast,
  outlined,
  disabled,
  href,
  ...rest
}) => {
  const getStyle = () => {
    if (primary) return styles.primary;
    if (secondary) return styles.secondary;
    if (outlined) return styles.outlined;
    if (contrast) return styles.contrast;
    return '';
  };

  if (href) {
    return (
      <Link href={href} className={`${styles.button} ${extraClass || ''} ${getStyle()} `}>
        {children}
        {text}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type || 'button'}
      onClick={onClick || undefined}
      onKeyDown={(event) => event.key === 'Enter' && (onClick || undefined)}
      disabled={disabled || false}
      className={`${styles.button} ${extraClass || ''} ${getStyle()}`}
    >
      {children}
      {text}
    </button>
  );
};

export default Button;
