import styles from './FormContainer.module.scss';

const FormContainer = ({ children }) => <div className={styles.container}>{children}</div>;

export default FormContainer;
