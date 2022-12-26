import styles from './Form.module.scss';

export default function Form({ children, handleSubmit, title, ...rest }) {
  return (
    <form className={styles.form} onSubmit={handleSubmit || null} {...rest}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </form>
  );
}
