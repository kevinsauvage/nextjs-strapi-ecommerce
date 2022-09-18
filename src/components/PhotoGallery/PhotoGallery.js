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
  }, []);

  useEffect(() => {
    setThumbWidth(containerWidth / thumbsPerSlide - 5);
  }, [containerWidth, thumbsPerSlide]);

  return (
    <div className={styles.container} ref={galleryRef}>
      <div className={styles.selected}>
        <Image
          src={selectedVariant.image.src}
          alt={selectedVariant}
          width="100%"
          height="100%"
          layout="fill"
          objectFit="cover"
        />
      </div>
      {items && items.length > 1 && (
        <div className={styles.gallery}>
          <ul className={styles.list}>
            {items.map((item) => {
              const { src } = item.image;
              return (
                <div
                  key={item.id}
                  className={styles.item}
                  style={
                    thumbWidth && {
                      width: `${thumbWidth}px`,
                      height: `${thumbWidth}px`,
                    }
                  }
                >
                  <button
                    className={styles.btn}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onKeyDown={() => handleSelect(item)}
                  >
                    <Image
                      src={src}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      width="100%"
                      height="100%"
                    />
                  </button>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
