import styles from './Loader.module.scss';

export default function Loader({ text }) {
  return (
    <div className={styles.loader}>
      <div>{text || 'Loading...'}</div>
    </div>
  );
}
