import { Children, cloneElement, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './Carousel.module.scss';

export function CarouselItem({ children, width }) {
  return (
    <div className={styles.CarouselItem} style={{ width }}>
      {children}
    </div>
  );
}

function Carousel({ children, title, itemToShow = 5 }) {
  const [translatePosition, setTranslatePosition] = useState(0);
  const carouselRef = useRef(null);
  const itemWidth = 100 / itemToShow;

  const handleNext = () => {
    const carouselWidth = carouselRef?.current?.getBoundingClientRect().width;
    const innerHeight = (carouselWidth / 100) * itemWidth;

    const maxTranslatePosition =
      innerHeight * Children.count(children) - carouselWidth;

    if (translatePosition >= maxTranslatePosition) {
      return;
    }
    const nextPosition = translatePosition + carouselWidth;
    console.log(nextPosition);
    if (nextPosition > maxTranslatePosition) {
      return setTranslatePosition(maxTranslatePosition);
    }
    return setTranslatePosition(nextPosition);
  };

  const handlePrev = () => {
    const carouselWidth = carouselRef?.current?.getBoundingClientRect().width;
    const prevPosition = translatePosition - carouselWidth;
    if (prevPosition < 0) return setTranslatePosition(0);
    return setTranslatePosition(prevPosition);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
  });

  return (
    <>
      <h5 className={styles.title}>{title}</h5>
      <div {...handlers} className={styles.Carousel}>
        <button
          className={`${styles.previous} ${styles.button}`}
          type="button"
          onClick={handlePrev}
        >
          <IoIosArrowBack />
        </button>
        <div
          ref={carouselRef}
          className={styles.inner}
          style={{ transform: `translateX(-${translatePosition}px)` }}
        >
          {Children.map(children, (child) =>
            cloneElement(child, {
              width: `${itemWidth}%`,
            })
          )}
        </div>
        <button
          className={`${styles.next} ${styles.button}`}
          type="button"
          onClick={handleNext}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </>
  );
}

export default Carousel;
