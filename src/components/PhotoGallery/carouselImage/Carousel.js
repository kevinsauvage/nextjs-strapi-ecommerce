import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useRouter } from 'next/router';
import styles from './Carousel.module.scss';

export function CarouselItem({ children, height }) {
  return (
    <div className={styles.CarouselItem} style={{ height }}>
      {children}
    </div>
  );
}

function Carousel({ children, itemToShow = 4 }) {
  const [maxTranslatePosition, setMaxTranslatePosition] = useState(0);
  const [translatePosition, setTranslatePosition] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const [itemHeight] = useState(100 / itemToShow);
  const { asPath } = useRouter();
  const carouselRef = useRef(null);

  useEffect(() => {
    setTranslatePosition(0);
  }, [asPath]);

  useEffect(() => {
    if (carouselRef?.current) {
      const height = carouselRef?.current?.getBoundingClientRect().height;
      const totalHeight = (height / 100) * itemHeight;
      const position = totalHeight * Children.count(children) - height;
      setMaxTranslatePosition(position);
      setCarouselHeight(height);
    }
  }, [children, itemHeight, carouselRef]);

  const handleNext = () => {
    if (translatePosition === maxTranslatePosition) return null;
    const nextPosition = translatePosition + carouselHeight;
    if (nextPosition > maxTranslatePosition) {
      return setTranslatePosition(maxTranslatePosition);
    }
    return setTranslatePosition(nextPosition);
  };

  const handlePrev = () => {
    const prevPosition = translatePosition - carouselHeight;
    if (prevPosition < 0) return setTranslatePosition(0);
    return setTranslatePosition(prevPosition);
  };

  const handlers = useSwipeable({
    onSwipedUp: () => handleNext(),
    onSwipedDown: () => handlePrev(),
  });

  return (
    <div {...handlers} className={styles.Carousel}>
      <button
        className={`${styles.previous} ${styles.button}`}
        type="button"
        disabled={translatePosition === 0}
        onClick={handlePrev}
      >
        <IoIosArrowUp />
      </button>
      <div
        ref={carouselRef}
        className={styles.inner}
        style={{ transform: `translateY(-${translatePosition}px)` }}
      >
        {Children.map(children, (child) =>
          cloneElement(child, {
            height: `${itemHeight}%`,
          })
        )}
      </div>
      <button
        className={`${styles.next} ${styles.button}`}
        type="button"
        disabled={translatePosition === maxTranslatePosition}
        onClick={handleNext}
      >
        <IoIosArrowDown />
      </button>
    </div>
  );
}

export default Carousel;
