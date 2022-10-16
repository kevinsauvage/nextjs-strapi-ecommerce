import { Children, cloneElement, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import styles from './Carousel.module.scss';

export function CarouselItem({ children, height }) {
  return (
    <div className={styles.CarouselItem} style={{ height }}>
      {children}
    </div>
  );
}

function Carousel({ children, itemToShow = 4 }) {
  const [translatePosition, setTranslatePosition] = useState(0);
  const carouselRef = useRef(null);
  const itemHeight = 100 / itemToShow;

  const handleNext = () => {
    const carouselHeight = carouselRef?.current?.getBoundingClientRect().height;
    const innerHeight = (carouselHeight / 100) * itemHeight;

    const maxTranslatePosition =
      innerHeight * Children.count(children) - carouselHeight;

    if (translatePosition === maxTranslatePosition) {
      return null;
    }
    const nextPosition = translatePosition + carouselHeight;
    console.log(nextPosition);
    if (nextPosition > maxTranslatePosition) {
      return setTranslatePosition(maxTranslatePosition);
    }
    return setTranslatePosition(nextPosition);
  };

  const handlePrev = () => {
    const carouselHeight = carouselRef?.current?.getBoundingClientRect().height;
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
        onClick={handleNext}
      >
        <IoIosArrowDown />
      </button>
    </div>
  );
}

export default Carousel;
