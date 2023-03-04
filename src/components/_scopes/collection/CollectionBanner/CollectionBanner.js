import Image from 'next/image';

import Container from '@/components/Container/Container';

import styles from './CollectionBanner.module.scss';

function CollectionBanner({ title, description, image }) {
  return (
    <Container>
      <div className={styles.CollectionBanner}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>
        {image && (
          <div className={styles.image}>
            <Image src={image.large} priority alt={description} width={image.width} height={image.height} />
          </div>
        )}
      </div>
    </Container>
  );
}

export default CollectionBanner;
