import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './PhotoGallery.module.scss';

export default function PhotoGallery({
  items,
  selectedVariant,
  handleSelect,
  thumbsPerSlide = 4,
}) {
  const [containerWidth, setContainerWidth] = useState(null);
  const [thumbWidth, setThumbWidth] = useState(null);

  const galleryRef = useRef(null);

  useEffect(() => {
    setContainerWidth(galleryRef.current.getBoundingClientRect().width);
  }, [galleryRef?.current]);

  useEffect(() => {
    setThumbWidth(containerWidth / thumbsPerSlide - 5);
  }, [containerWidth]);

  return (
    <div className={styles.container} ref={galleryRef}>
      <div className={styles.selected}>
        <Image
          src={selectedVariant.image.src}
          alt={selectedVariant}
          width={selectedVariant.image.width}
          height={selectedVariant.image.height}
          layout="responsive"
          objectFit="cover"
        />
      </div>
      <div className={styles.gallery}>
        <ul className={styles.list}>
          {items &&
            items.map((item) => {
              const { width, height, src } = item.image;
              return (
                <div
                  className={styles.item}
                  style={thumbWidth && { width: `${thumbWidth}px` }}
                >
                  <button
                    className={styles.btn}
                    type="button"
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onKeyDown={() => handleSelect(item)}
                  >
                    <Image
                      src={src}
                      alt={item.title}
                      layout="responsive"
                      width={width}
                      height={height}
                    />
                  </button>
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
