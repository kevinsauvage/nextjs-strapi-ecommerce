import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title }) {
  return (
    <div className={styles.CollectionBanner}>
      <div className={styles.inner}>
        <h1 className={`${styles.title}`}>{title}</h1>
      </div>
    </div>
  );
}

export default CollectionBanner;
