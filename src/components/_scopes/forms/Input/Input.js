import styles from './Input.module.scss';

const Input = ({ id, name, type, label, placeholder, onChange, required, invalid, ...rest }) => (
    <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
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

export default Input;
