import Image from 'next/image';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ images = [], alt }) {
  return (
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
  );
}
