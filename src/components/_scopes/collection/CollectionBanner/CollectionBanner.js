import Container from '@/components/Container/Container';

import styles from './CollectionBanner.module.scss';

const CollectionBanner = ({ title, description }) => (
    <div className={styles.CollectionBanner}>
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Container>
    </div>
  );

export default CollectionBanner;
