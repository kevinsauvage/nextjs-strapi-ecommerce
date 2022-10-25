import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';
import { useRouter } from 'next/router';
import styles from './Carousel.module.scss';
import Indicators from './Indicators/Indicators';
import Separator from '../Separator/Separator';

export function CarouselItem({ children, width, height }) {
  return (
    <div className={styles.CarouselItem} style={{ width, height }}>
      {children}
    </div>
  );
}

function Carousel({
  children,
  title,
  subtitle,
  itemToShow = 5,
  vertical,
  horizontal,
  showButtons = true,
  showSeparator,
}) {
  const [maxTranslatePosition, setMaxTranslatePosition] = useState(0);
  const [translatePosition, setTranslatePosition] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
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

  // Handle horizontal position
  useEffect(() => {
    if (carouselRef?.current && horizontal) {
      const width = carouselRef?.current?.getBoundingClientRect().width;
      const totalWidth = (width / 100) * itemDimension;
      const position = totalWidth * Children.count(children) - width;
      setMaxTranslatePosition(position);
      setCarouselWidth(width);
    }
  }, [children, itemDimension, carouselRef, horizontal]);

  // Handle vertical position
  useEffect(() => {
    if (carouselRef?.current && vertical) {
      const height = carouselRef?.current?.getBoundingClientRect().height;
      const totalHeight = (height / 100) * itemDimension;
      const position = totalHeight * Children.count(children) - height;
      setMaxTranslatePosition(position);
      setCarouselHeight(height);
    }
  }, [children, itemDimension, carouselRef, vertical]);

  const handleChangeIndex = (i) => {
    console.log(i, 'i');
    console.log(maxIndex, 'maxIndex');
    if (i < 0) setIndex(0);
    else if (i + 1 > maxIndex) setIndex(maxIndex);
    else setIndex(i);
  };

  useEffect(() => {
    const newPosition = horizontal
      ? index * carouselWidth
      : index * carouselHeight;

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
  }, [
    carouselHeight,
    carouselWidth,
    horizontal,
    index,
    maxTranslatePosition,
    translatePosition,
  ]);

  const handlersObject = horizontal
    ? {
        onSwipedLeft: () => handleChangeIndex(index + 1),
        onSwipedRight: () => handleChangeIndex(index - 1),
      }
    : {
        onSwipedUp: () => handleChangeIndex(index + 1),
        onSwipedDown: () => handleChangeIndex(index - 1),
      };

  const handlers = useSwipeable({ ...handlersObject });

  return (
    <>
      <div className={styles.header}>
        {title && horizontal && <h2 className={styles.title}>{title}</h2>}
        {horizontal && (
          <Indicators
            activeIndex={index}
            totalItems={Children.count(children)}
            itemsToShow={itemToShow}
            handleClick={handleChangeIndex}
          />
        )}
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {showSeparator && <Separator />}
      <div
        {...handlers}
        className={`${styles.Carousel} ${
          vertical ? styles.vertical : styles.horizontal
        }`}
      >
        {showButtons && (
          <button
            className={`${styles.button}`}
            type="button"
            disabled={translatePosition === 0}
            onClick={() => handleChangeIndex(index - 1)}
          >
            {horizontal ? <IoIosArrowBack /> : <IoIosArrowUp />}
          </button>
        )}
        <div
          ref={carouselRef}
          className={styles.inner}
          style={{
            transform: vertical
              ? `translateY(-${translatePosition}px)`
              : `translateX(-${translatePosition}px)`,
          }}
        >
          {Children.map(children, (child) =>
            cloneElement(child, {
              width: horizontal && `${itemDimension}%`,
              height: vertical && `${itemDimension}%`,
            })
          )}
        </div>
        {showButtons && (
          <button
            className={`${styles.next} ${styles.button}`}
            type="button"
            disabled={translatePosition === maxTranslatePosition}
            onClick={() => handleChangeIndex(index + 1)}
          >
            {horizontal ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
        )}
      </div>
    </>
  );
}

export default Carousel;
