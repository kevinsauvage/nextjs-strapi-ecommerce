import Image from 'next/image';
import { useEffect, useState } from 'react';
import Carousel, { CarouselItem } from './carouselImage/Carousel';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({ selectedVariant, images = [] }) {
  const [selected, setSelected] = useState(undefined);

  useEffect(() => {
    setSelected(undefined);
  }, [selectedVariant]);

  return (
    <div className={styles.container}>
      {selectedVariant?.id && (
        <div className={styles.selectedImage}>
          <Image
            src={selected?.sm || selectedVariant?.image?.sm}
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
            quality={100}
            blurDataURL={
              selected?.blurDataURL || selectedVariant?.image?.blurDataURL
            }
            placeholder="blur"
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
                src={image?.sm}
                alt={image?.alt || selectedVariant?.title}
                layout="fill"
                objectFit="cover"
                blurDataURL={image?.blurDataURL}
                placeholder="blur"
              />
            </button>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}
