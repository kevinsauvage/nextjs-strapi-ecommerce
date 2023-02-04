import styles from './Input.module.scss';

export default function Input({ id, name, type, label, placeholder, onChange, required, missing, ...rest }) {
  return (
    <label htmlFor={id} className={`${styles.label} ${missing && styles.missing}`}>
      <b className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </b>
      <input
        className={`${styles.input}`}
        id={id}
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
}
