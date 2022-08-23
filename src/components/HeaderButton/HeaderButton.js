import styles from './HeaderButton.module.scss';

export default function HeaderButton({ children, handleClick, ...rest }) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.button}
      {...rest}
    >
      {children}
    </button>
  );
}
