import styles from './Container.module.scss';

const Container = ({ children, extraClass, size, ...rest }) => (
  <div className={`${styles.container} ${extraClass || ''} ${styles[size]}`} {...rest}>
    {children}
  </div>
);

export default Container;
