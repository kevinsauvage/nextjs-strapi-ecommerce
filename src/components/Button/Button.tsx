'use client';

import Link from 'next/link';

import styles from './Button.module.scss';

const Button = ({
  children,
  type,
  onClick,
  text,
  extraClass,
  primary = true,
  secondary,
  contrast,
  outlined,
  disabled,
  href,
  ...rest
}: {
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  text?: string;
  extraClass?: string;
  primary?: boolean;
  secondary?: boolean;
  contrast?: boolean;
  outlined?: boolean;
  disabled?: boolean;
  href?: string;
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
      <Link
        href={href}
        className={`${styles.button} ${extraClass || ''} ${getStyle()} ${disabled ? styles.disabled : ''}`}
      >
        {children}
        {text}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type || 'button'}
      onClick={() => {
        if (onClick) onClick();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onClick) {
          onClick();
        }
      }}
      disabled={disabled || false}
      className={`${styles.button} ${extraClass || ''} ${getStyle()}`}
    >
      {children}
      {text}
    </button>
  );
};

export default Button;
