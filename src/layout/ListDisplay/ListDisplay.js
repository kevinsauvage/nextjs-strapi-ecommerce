import styles from './ListDisplay.module.scss';

export default function ListDisplay({ children, layout }) {
  return (
    <ul className={`${styles.ListDisplay} ${styles[layout]}`}>{children}</ul>
  );
}
