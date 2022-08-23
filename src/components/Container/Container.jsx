import styles from './Container.module.scss';

export default function Container({ children, ...rest }) {
  return (
    <div className={styles.container} {...rest}>
      {children}
    </div>
  );
}
