import Image from 'next/image';
import { useEffect, useState } from 'react';
import AbsoluteLoader from '@/layout/Loader/AbsoluteLoader/AbsoluteLoader';
import Carousel, { CarouselItem } from './carouselImage/Carousel';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ selectedVariant, images = [] }) {
  const [selected, setSelected] = useState(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSelected(undefined);
  }, [selectedVariant]);

  useEffect(() => {
    setLoaded(false);
  }, [selected?.src, selectedVariant?.id]);

  return (
    <div className={styles.container}>
      {selectedVariant?.id && (
        <div className={styles.selectedImage}>
          {!loaded && <AbsoluteLoader />}
          <Image
            src={selected?.src || selectedVariant?.image?.src}
            alt={
              selected?.alt ||
              selectedVariant?.image?.alt ||
              selectedVariant?.title
            }
            width={500}
            height={750}
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
            priority
            quality={70}
            onLoadingComplete={() => setLoaded(true)}
            placeholder="blur"
            blurDataURL={
              selected?.blurDataURL || selectedVariant?.image?.blurDataURL
            }
          />
        </div>
      )}
      <Carousel>
        {images.map((image) => (
          <CarouselItem key={image.src}>
            <button
              type="button"
              className={
                `${styles.item} ` +
                `${image.src === selected?.src ? styles.selected : ''}`
              }
              onClick={() => setSelected(image)}
            >
              <Image
                src={image?.s}
                alt={image?.alt || selectedVariant?.title}
                layout="fill"
                objectFit="cover"
                blurDataURL={image?.blurDataURL}
                placeholder="blur"
                quality={50}
              />
            </button>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}
