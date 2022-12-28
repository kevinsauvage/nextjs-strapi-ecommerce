import styles from './Input.module.scss';

export default function Input({
  id,
  name,
  type,
  label,
  placeholder,
  onChange,
  required,
  textarea,
  autoComplete,
  value,
  ...rest
}) {
  if (textarea) {
    return (
      <label htmlFor={id} className={styles.label}>
        <p className={styles.title}>{label}</p>

        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id={id}
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          {...rest}
        />
      </label>
    );
  }

  if (value) {
    return (
      <label htmlFor={id} className={styles.label}>
        <p className={styles.title}>
          {label}
          {required ? <span className={styles.required}>*</span> : ''}
        </p>
        <input
          className={styles.input}
          id={id}
          type={type || 'text'}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete || ''}
          value={value || ''}
          {...rest}
        />
      </label>
    );
  }

  return (
    <label htmlFor={id} className={styles.label}>
      <p className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </p>

      <input
        className={styles.input}
        id={id}
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete || ''}
        {...rest}
      />
    </label>
  );
}
