import styles from './Wrapper.module.scss';

export default function Wrapper({ children, gap, stylesProp, ...rest }) {
  return (
    <div
      className={styles.container}
      style={{ gap: gap || '1rem', ...stylesProp }}
      {...rest}
    >
      {children}
    </div>
  );
}
