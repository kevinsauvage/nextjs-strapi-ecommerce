import Image from 'next/legacy/image';

import Carousel from '@/components/Carousel/Carousel';

import styles from './PhotoGallery.module.scss';

const PhotoItem = ({ image }) => (
  <div className={styles['gallery-image']}>
    <Image
      src={image?.src}
      alt={image?.alt}
      width={image?.width}
      height={image?.height}
      blurDataURL={image?.blurDataURL}
      placeholder="blur"
      quality={50}
      className={styles.image}
    />
  </div>
);

const PhotoGallery = ({ images = [] }) => {
  console.log('🚀 ~ file: PhotoGallery.js:24 ~ PhotoGallery ~ images:', images);

  return (
    Array.isArray(images) && (
      <>
        <div className={styles.gallery}>
          <div className={styles.inner}>
            {images.map((image) => (
              <PhotoItem key={image?.src} image={image} />
            ))}
          </div>
        </div>
        <div className={styles.carousel}>
          <Carousel itemToShow={1} spacing={0}>
            {images.map((image) => (
              <PhotoItem key={image?.src} image={image} />
            ))}
          </Carousel>
        </div>
      </>
    )
  );
};
export default PhotoGallery;
