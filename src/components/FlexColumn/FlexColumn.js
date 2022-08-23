import styles from './FlexColumn.module.scss';

export default function FlexColumn({ children, gap, ...rest }) {
  return (
    <div
      {...rest}
      className={styles.FlexColumn}
      style={{ gap: gap || '1rem', ...rest.style }}
    >
      {children}
    </div>
  );
}
