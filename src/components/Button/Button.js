/* eslint-disable react/button-has-type */
import styles from './Button.module.scss';

export default function Button({
  type,
  onClick,
  text,
  extraStyles,
  extraClass,
  primary,
  secondary,
  tertiary,
  disabled,
}) {
  const getStyle = () => {
    if (primary) return styles.primary;
    if (secondary) return styles.secondary;
    if (tertiary) return styles.tertiary;
    return '';
  };

  return (
    <button
      type={type || 'button'}
      onClick={onClick || null}
      styles={extraStyles}
      disabled={disabled || false}
      className={`${styles.button} ${extraClass || ''} ${getStyle()} `}
    >
      {text}
    </button>
  );
}
