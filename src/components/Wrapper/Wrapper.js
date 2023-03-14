import styles from './Wrapper.module.scss';

const Wrapper = ({ children, gap }) => (
    <div className={styles.wrapper} style={{ gap }}>
      {children}
    </div>
  );

export default Wrapper;
