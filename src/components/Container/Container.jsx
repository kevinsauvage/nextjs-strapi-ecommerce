import styles from './Container.module.scss';

export default function Container({ children, extraClass, ...rest }) {
  return (
    <div className={`${styles.container} ${extraClass || ''}`} {...rest}>
      {children}
    </div>
  );
}
