import { Children, cloneElement, useEffect, useRef, useState } from 'react';
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
  const [maxTranslatePosition, setMaxTranslatePosition] = useState(0);
  const [translatePosition, setTranslatePosition] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [itemWidth] = useState(100 / itemToShow);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef?.current) {
      const width = carouselRef?.current?.getBoundingClientRect().width;
      const totalWidth = (width / 100) * itemWidth;
      const position = totalWidth * Children.count(children) - width;
      setMaxTranslatePosition(position);
      setCarouselWidth(width);
    }
  }, [children, itemWidth, carouselRef]);

  const handleNext = () => {
    if (translatePosition >= maxTranslatePosition) return null;
    const nextPosition = translatePosition + carouselWidth;
    if (nextPosition > maxTranslatePosition) {
      return setTranslatePosition(maxTranslatePosition);
    }
    return setTranslatePosition(nextPosition);
  };

  const handlePrev = () => {
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
          className={`${styles.button}`}
          type="button"
          disabled={translatePosition === 0}
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
          disabled={translatePosition === maxTranslatePosition}
          onClick={handleNext}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </>
  );
}

export default Carousel;
