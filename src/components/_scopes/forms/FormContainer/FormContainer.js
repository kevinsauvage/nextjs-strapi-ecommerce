import styles from './FormContainer.module.scss';

function FormContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default FormContainer;
