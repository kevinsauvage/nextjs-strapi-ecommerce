// eslint-disable-next-line css-modules/no-unused-class
import styles from './Container.module.scss';

const Container = ({ children, extraClass, size, ...rest }) => (
  <div className={`${styles.container} ${extraClass || ''} ${styles[size]}`} {...rest}>
    {children}
  </div>
);

export default Container;
