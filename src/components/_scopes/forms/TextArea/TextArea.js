import styles from './TextArea.module.scss';

export default function TextArea({ id, label, required, invalid, ...rest }) {
  return (
    <label htmlFor={id} className={`${styles.label} ${invalid && styles.missing}`}>
      <b className={styles.title}>
        {label}
        {required ? <span className={styles.required}>*</span> : ''}
      </b>

      <textarea className={styles.textarea} type="text" {...rest} />
    </label>
  );
}
