import styles from './Input.module.scss';

export default function Input({
  id,
  name,
  label,
  placeholder,
  onChange,
  required,
  textarea,
}) {
  return (
    <label htmlFor={id} className={styles.label}>
      <p className={styles.title}>{label}</p>

      {textarea ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id={id}
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          className={styles.input}
          id={id}
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
        />
      )}
    </label>
  );
}
