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
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      {children}
    </form>
  );
}
