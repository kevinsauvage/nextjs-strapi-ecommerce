import styles from './TextArea.module.scss';

const TextArea = ({ id, label, required, invalid, ...rest }) => (
  <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
    <b className={styles.title}>
      {label}
      {required ? <span>*</span> : ''}
    </b>

    <textarea className={styles.textarea} type="text" {...rest} />
  </label>
);
export default TextArea;
