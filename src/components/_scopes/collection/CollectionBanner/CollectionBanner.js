import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title, description }) {
  return (
    <div className={styles.CollectionBanner}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{description}</p>
    </div>
  );
}

export default CollectionBanner;
