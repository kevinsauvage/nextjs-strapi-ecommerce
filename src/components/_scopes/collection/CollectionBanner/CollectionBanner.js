import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title, description }) {
  return (
    <div className={styles.CollectionBanner}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}

export default CollectionBanner;
