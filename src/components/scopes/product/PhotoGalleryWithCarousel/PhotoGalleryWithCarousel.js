import Image from 'next/image';
import { useEffect, useState } from 'react';
import AbsoluteLoader from '@/layout/Loader/AbsoluteLoader/AbsoluteLoader';
import CarouselVertical from '@/components/CarouselVertical/Carousel';
import styles from './PhotoGalleryWithCarousel.module.scss';

export default function PhotoGalleryWithCarousel({
  selectedVariant,
  images = [],
}) {
  const [selected, setSelected] = useState(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSelected(undefined);
  }, [selectedVariant]);

  useEffect(() => {
    setLoaded(false);
  }, [selected?.src, selectedVariant?.image?.src]);

  return (
    <div className={styles.container}>
      {selectedVariant?.id && (
        <div className={styles.selectedImage}>
          {!loaded && <AbsoluteLoader />}
          <Image
            className={styles.image}
            src={selected?.large || selectedVariant?.image?.large}
            alt={
              selected?.altText ||
              selectedVariant?.image?.altText ||
              selectedVariant?.title
            }
            width={selected?.width || selectedVariant?.image?.width}
            height={selected?.height || selectedVariant?.image?.height}
            quality={50}
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
      )}
      <CarouselVertical itemToShow={4} showButtons>
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            className={
              `${styles.item} ` +
              `${image.src === selected?.src ? styles.selected : ''}`
            }
            onClick={() => setSelected(image)}
          >
            <Image
              src={image?.small}
              alt={image?.altText || selectedVariant?.title}
              width={image?.width}
              height={image?.height}
              quality={10}
              className={styles.image}
            />
          </button>
        ))}
      </CarouselVertical>
    </div>
  );
}
