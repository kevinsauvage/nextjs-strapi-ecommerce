import Image from 'next/legacy/image';

import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ images = [], alt }) {
  return (
    Array.isArray(images) && (
      <div className={styles.gallery}>
        {images.map((image) => (
          <div key={image?.src} className={styles.galleryImage}>
            <Image
              src={image?.src}
              alt={image?.alt || alt}
              width={image?.width}
              height={image?.height}
              blurDataURL={image?.blurDataURL}
              placeholder="blur"
              quality={50}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    )
  );
}
