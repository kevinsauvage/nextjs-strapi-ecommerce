import styles from './Container.module.scss';

export default function Container({ children, extraClass, size, ...rest }) {
  return (
    <div className={`${styles.container} ${extraClass || ''} ${styles[size]}`} {...rest}>
      {children}
    </div>
  );
}
