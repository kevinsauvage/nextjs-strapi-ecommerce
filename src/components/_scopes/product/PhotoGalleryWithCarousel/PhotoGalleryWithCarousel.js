import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import { useEffect, useState } from 'react';
import styles from './PhotoGalleryWithCarousel.module.scss';

export default function PhotoGalleryWithCarousel({ images }) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected(images?.[0]);
  }, [images]);

  return (
    <div className={styles.container}>
      {selected?.src && (
        <Image
          className={styles.image}
          src={selected?.large}
          alt={selected?.altText || 'selected'}
          width={selected?.width}
          height={selected?.height}
          blurDataURL={selected?.blurDataURL}
          placeholder="blur"
          quality={50}
          priority
        />
      )}
      {images?.length > 1 && (
        <Carousel itemToShow={8} showButtons spacing={0}>
          {images
            .filter((image) => image.width > 200)
            .map((variant, i) => (
              <button
                key={variant.src}
                type="button"
                aria-label={variant?.title}
                name={variant?.title}
                className={`${styles.item} ${variant?.image?.src === selected?.src ? styles.selected : ''}`}
                onClick={() => setSelected(variant)}
              >
                <Image
                  src={variant?.small}
                  alt={variant?.altText || `variant ${i}`}
                  width={variant?.width}
                  height={variant?.height}
                  blurDataURL={variant?.blurDataURL}
                  placeholder="blur"
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
