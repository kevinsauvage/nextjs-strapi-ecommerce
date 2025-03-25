import styles from './TextArea.module.scss';

const TextArea = ({ id, label, required, invalid, error, ...rest }) => (
  <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
    <b className={styles.title}>
      {label}
      {required ? <span>*</span> : ''}
    </b>

    <textarea className={`${styles.textarea} ${error && styles.error}`} type="text" {...rest} />
    <small className={styles.error}>{error}</small>
  </label>
);
export default TextArea;
