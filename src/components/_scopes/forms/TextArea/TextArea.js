import styles from './TextArea.module.scss';

export default function TextArea({ id, label, required, ...rest }) {
  return (
    <label htmlFor={id} className={styles.label}>
      <b className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </b>

      <textarea
        className={styles.textarea}
        type="text"
        required={required}
        {...rest}
      />
    </label>
  );
}
