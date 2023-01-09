import styles from './Input.module.scss';

export default function Input({
  id,
  name,
  type,
  label,
  placeholder,
  onChange,
  required,
  autoComplete,
  ...rest
}) {
  return (
    <label htmlFor={id} className={styles.label}>
      <b className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </b>
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
