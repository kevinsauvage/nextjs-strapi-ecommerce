import styles from './AbsoluteLoader.module.scss';

export default function AbsoluteLoader({ text }) {
  return (
    <div className={styles.loader}>
      <div>{text || 'Loading...'}</div>
    </div>
  );
}
