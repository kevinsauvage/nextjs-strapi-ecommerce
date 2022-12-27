/* eslint-disable react/button-has-type */
import Link from 'next/link';
import styles from './Button.module.scss';

export default function Button({
  children,
  type,
  onClick,
  text,
  extraClass,
  primary,
  secondary,
  quaternary,
  tertiary,
  disabled,
  href,
  ...rest
}) {
  const getStyle = () => {
    if (primary) return styles.primary;
    if (secondary) return styles.secondary;
    if (tertiary) return styles.tertiary;
    if (quaternary) return styles.quaternary;
    return '';
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${styles.button} ${extraClass || ''} ${getStyle()} `}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type || 'button'}
      onClick={onClick || null}
      onKeyDown={(e) => e.key === 'Enter' && (onClick || null)}
      disabled={disabled || false}
      className={`${styles.button} ${extraClass || ''} ${getStyle()}`}
    >
      {children}
      {text}
    </button>
  );
}
