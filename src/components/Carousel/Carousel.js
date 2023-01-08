import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useRouter } from 'next/router';
import styles from './Carousel.module.scss';
import Indicators from './Indicators/Indicators';

function Carousel({ children, title, itemToShow = 5 }) {
  const [maxTranslatePosition, setMaxTranslatePosition] = useState(0);
  const [translatePosition, setTranslatePosition] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [itemDimension] = useState(100 / itemToShow);
  const carouselRef = useRef(null);
  const { asPath } = useRouter();
  const [index, setIndex] = useState(0);
  const [maxIndex] = useState(
    Math.ceil(Children.count(children) / itemToShow - 1)
  );

  useEffect(() => {
    setTranslatePosition(0);
  }, [asPath]);

  useEffect(() => {
    if (carouselRef?.current) {
      const width = carouselRef?.current?.getBoundingClientRect().width;
      const totalWidth = (width / 100) * itemDimension;
      const position = totalWidth * Children.count(children) - width;
      setMaxTranslatePosition(position);
      setCarouselWidth(width);
    }
  }, [children, itemDimension, carouselRef]);

  const handleChangeIndex = (i) => {
    if (i < 0) setIndex(0);
    else if (i + 1 > maxIndex) setIndex(maxIndex);
    else setIndex(i);
  };

  useEffect(() => {
    const newPosition = index * carouselWidth;

    if (newPosition === translatePosition) return;
    if (newPosition < translatePosition) {
      if (newPosition < 0) setTranslatePosition(0);
      else setTranslatePosition(newPosition);
    }

    if (newPosition > translatePosition) {
      if (newPosition > maxTranslatePosition)
        setTranslatePosition(maxTranslatePosition);
      else setTranslatePosition(newPosition);
    }
  }, [carouselWidth, index, maxTranslatePosition, translatePosition]);

  const handlersObject = {
    onSwipedLeft: () => handleChangeIndex(index + 1),
    onSwipedRight: () => handleChangeIndex(index - 1),
  };

  const handlers = useSwipeable({ ...handlersObject });

  return (
    <div className={styles.container}>
      {title ? (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <Indicators
            activeIndex={index}
            totalItems={Children.count(children)}
            itemsToShow={itemToShow}
            handleClick={handleChangeIndex}
          />
        </div>
      ) : null}
      <div {...handlers} className={`${styles.Carousel}`}>
        <div
          ref={carouselRef}
          className={styles.inner}
          style={{
            transform: `translateX(-${translatePosition}px)`,
          }}
        >
          {Children.map(children, (child) => (
            <div
              className={styles.CarouselItem}
              style={{ width: `${itemDimension}%` }}
            >
              {cloneElement(child)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
