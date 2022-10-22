import styles from './PageLoader.module.scss';

export default function PageLoader({ text, position }) {
  return (
    <div className={styles.loader} style={{ position }}>
      <div>{text || 'Loading...'}</div>
    </div>
  );
}
