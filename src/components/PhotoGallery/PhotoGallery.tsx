import Image from 'next/image';

import Carousel from '@/components/Carousel/Carousel';

import styles from './PhotoGallery.module.scss';

const PhotoItem = ({ image, alt }: { image: ImageFields; alt: string }) =>
  typeof image.src === 'string' && (
    <div className={styles['gallery-image']}>
      <Image
        src={image?.src}
        alt={image?.altText || alt}
        width={image?.width}
        height={image?.height}
        blurDataURL={image?.blurDataURL}
        placeholder="blur"
        quality={50}
        className={styles.image}
      />
    </div>
  );

const PhotoGallery = ({
  images = [],
  alt,
}: {
  images: ImageFields[] | ImageFields | undefined;
  alt: string;
}) => {
  return Array.isArray(images) ? (
    <>
      <div className={styles.gallery}>
        <div className={styles.inner}>
          {images.map(
            (image) =>
              typeof image?.src === 'string' && (
                <PhotoItem key={image?.src} image={image} alt={alt} />
              ),
          )}
        </div>
      </div>
      <div className={styles.carousel}>
        <Carousel itemToShow={1} spacing={0} title="Gallery" showButtons={false}>
          {images.map(
            (image) =>
              typeof image?.src === 'string' && (
                <PhotoItem key={image?.src} image={image} alt={alt} />
              ),
          )}
        </Carousel>
      </div>
    </>
  ) : (
    <div className={styles.gallery}>
      <PhotoItem image={images} alt={alt} />
    </div>
  );
};
export default PhotoGallery;
