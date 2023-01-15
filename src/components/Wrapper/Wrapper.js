import styles from './Wrapper.module.scss';

function Wrapper({ children, gap }) {
  return (
    <div className={styles.wrapper} style={{ gap }}>
      {children}
    </div>
  );
}

export default Wrapper;
