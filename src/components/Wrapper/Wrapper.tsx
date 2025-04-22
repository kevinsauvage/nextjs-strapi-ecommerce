import styles from './Wrapper.module.scss';

const Wrapper = ({ children, gap }: { children: React.ReactNode; gap?: number | string }) => (
  <div className={styles.wrapper} style={{ gap }}>
    {children}
  </div>
);

export default Wrapper;
