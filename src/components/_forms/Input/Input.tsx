import styles from './Input.module.scss';

const Input = ({
  id,
  type,
  label,
  required,
  invalid,
  value,
  error,
  ...rest
}: {
  id: string;
  type?: string;
  label: string;
  required?: boolean;
  invalid?: boolean;
  value?: string | number;
  error?: string | string[];
} & React.InputHTMLAttributes<HTMLInputElement>) => {
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

      {Array.isArray(error) ? (
        error.map((error_, index) => (
          <small key={index} className={styles.error}>
            {error_}
          </small>
        ))
      ) : (
        <small className={styles.error}>{error}</small>
      )}
    </label>
  );
};

export default Input;
