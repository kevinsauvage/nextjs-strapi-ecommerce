import styles from './Input.module.scss';

const Input = ({ id, type, label, required, invalid, value, error, ...rest }) => {
  return (
    <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
      <b className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </b>
      <input
        id={id}
        className={`${styles.input} ${error && styles.error}`}
        type={type || 'text'}
        value={value}
        {...rest}
      />
      <small className={styles.error}>{error}</small>
    </label>
  );
};

export default Input;
