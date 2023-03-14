import styles from './FormContainer.module.scss';

const FormContainer = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default FormContainer;
