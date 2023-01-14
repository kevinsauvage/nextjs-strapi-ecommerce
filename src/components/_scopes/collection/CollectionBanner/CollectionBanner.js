import CollectionNav from '../CollectionNav/CollectionNav';
import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title }) {
  return (
    <div className={styles.CollectionBanner}>
      <h1 className={`${styles.title} big`}>{title}</h1>
      <CollectionNav title={title} />
    </div>
  );
}

export default CollectionBanner;
