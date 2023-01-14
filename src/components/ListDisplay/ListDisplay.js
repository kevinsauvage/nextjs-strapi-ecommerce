import styles from './ListDisplay.module.scss';

export default function ListDisplay({ children, layout, gap }) {
  return (
    <ul className={`${styles.ListDisplay} ${styles[layout]}`} style={{ gap }}>
      {children}
    </ul>
  );
}
