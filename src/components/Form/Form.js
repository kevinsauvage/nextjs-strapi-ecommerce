import styles from './Form.module.scss';

export default function Form({
  children,
  handleSubmit,
  title,
  subtitle,
  ...rest
}) {
  return (
    <form className={styles.form} onSubmit={handleSubmit || null} {...rest}>
      <h2>{title}</h2>
      <p>{subtitle}</p>

      {children}
    </form>
  );
}
