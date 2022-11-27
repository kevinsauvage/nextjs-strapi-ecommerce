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
            src={selected?.src || selectedVariant?.image?.src}
            alt={
              selected?.altText ||
              selectedVariant?.image?.altText ||
              selectedVariant?.title
            }
            width={selected?.width || selectedVariant?.image?.width}
            height={selected?.height || selectedVariant?.image?.height}
            quality={70}
            onLoadingComplete={() => setLoaded(true)}
            placeholder="blur"
            blurDataURL={
              selected?.blurDataURL || selectedVariant?.image?.blurDataURL
            }
          />
        </div>
      )}
      {Array.isArray(images) && (
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
                src={image?.s}
                alt={image?.altText || selectedVariant?.title}
                width={image?.width}
                height={image?.height}
                placeholder="blur"
                blurDataURL={image?.blurDataURL}
                quality={50}
                loading="lazy"
                className={styles.image}
              />
            </button>
          ))}
        </CarouselVertical>
      )}
    </div>
  );
}
