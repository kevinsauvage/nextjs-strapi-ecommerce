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
  const [index] = useState(0);

  const galleryRef = useRef(null);

  useEffect(() => {
    setContainerWidth(galleryRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    setThumbWidth(containerWidth / thumbsPerSlide - 5 - 15);
  }, [containerWidth, thumbsPerSlide]);

  return (
    <div className={styles.container} ref={galleryRef}>
      <div className={styles.selected}>
        <Image
          src={selectedVariant?.image?.src}
          alt={selectedVariant}
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="cover"
        />
      </div>
      {items && items.length > 1 && (
        <div className={styles.gallery}>
          <ul
            className={styles.list}
            style={{ transform: `translate3d(-${index * thumbWidth})px` }}
          >
            <div className={`${styles.arrowLeft} ${styles.arrow}`}>Left</div>
            {items.map((item) => {
              const { sm } = item.image;
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
                      src={sm}
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
            <div className={`${styles.arrowRight} ${styles.arrow}`}>rigth</div>
          </ul>
        </div>
      )}
    </div>
  );
}
