import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import { useState } from 'react';
import styles from './PhotoGalleryWithCarousel.module.scss';

export default function PhotoGalleryWithCarousel({ images }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className={styles.container}>
      {selected?.src && (
        <div className={styles.selectedImage}>
          <Image
            className={styles.image}
            src={selected?.large}
            alt={selected?.altText}
            width={selected?.width}
            height={selected?.height}
            blurDataURL={selected?.blurDataURL}
            placeholder="blur"
            quality={50}
            priority
          />
        </div>
      )}
      {images.length > 1 && (
        <Carousel itemToShow={8} showButtons spacing={0}>
          {images
            .filter((image) => image.width > 200)
            .map((variant) => (
              <button
                key={variant.src}
                type="button"
                className={`${styles.item} ${variant?.image?.src === selected?.src ? styles.selected : ''}`}
                onClick={() => setSelected(variant)}
              >
                <Image
                  src={variant?.small}
                  alt={variant?.altText}
                  width={variant?.width}
                  height={variant?.height}
                  quality={10}
                  className={styles.image}
                />
              </button>
            ))}
        </Carousel>
      )}
    </div>
  );
}
