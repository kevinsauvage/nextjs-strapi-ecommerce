import styles from './FlexColumn.module.scss';

export default function FlexColumn({ children, gap, extraClass, ...rest }) {
  return (
    <div
      {...rest}
      className={`${styles.FlexColumn} ${extraClass || ''}`}
      style={{ gap: gap || '1rem', ...rest.style }}
    >
      {children}
    </div>
  );
}
