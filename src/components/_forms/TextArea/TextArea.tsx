import styles from './TextArea.module.scss';

const TextArea = ({
  id,
  label,
  required,
  invalid,
  error,
  ...rest
}: {
  id: string;
  label: string;
  required?: boolean;
  invalid?: boolean;
  error?: string | string[];
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
    <b className={styles.title}>
      {label}
      {required ? <span>*</span> : ''}
    </b>

    <textarea className={`${styles.textarea} ${error && styles.error}`} {...rest} />
    <small className={styles.error}>{error}</small>
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
export default TextArea;
