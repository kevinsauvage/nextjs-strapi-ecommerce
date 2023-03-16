import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSwipeable } from 'react-swipeable';
import { useRouter } from 'next/router';

import styles from './Carousel.module.scss';

const CarouselVertical = ({ children, itemToShow = 5, showButtons }) => {
  const [maxTranslatePosition, setMaxTranslatePosition] = useState(0);
  const [translatePosition, setTranslatePosition] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const [itemDimension] = useState(100 / itemToShow);
  const carouselReference = useRef(null);
  const { asPath } = useRouter();
  const [index, setIndex] = useState(0);
  const [maxIndex] = useState(Math.ceil(Children.count(children) / itemToShow - 1));

  useEffect(() => {
    setTranslatePosition(0);
  }, [asPath]);

  // Handle vertical position
  useEffect(() => {
    if (!carouselReference?.current) {
      return;
    }
    const height = carouselReference?.current?.getBoundingClientRect().height;
    const totalHeight = (height / 100) * itemDimension;
    const position = totalHeight * Children.count(children) - height;
    setMaxTranslatePosition(position);
    setCarouselHeight(height);
  }, [children, itemDimension, carouselReference]);

  const handleChangeIndex = (index_) => {
    if (index_ < 0) setIndex(0);
    else if (index_ + 1 > maxIndex) setIndex(maxIndex);
    else setIndex(index_);
  };

  useEffect(() => {
    const newPosition = index * carouselHeight;

    if (newPosition === translatePosition) return;
    if (newPosition < translatePosition) {
      if (newPosition < 0) setTranslatePosition(0);
      else setTranslatePosition(newPosition);
    }

    if (newPosition > translatePosition) {
      if (newPosition > maxTranslatePosition) setTranslatePosition(maxTranslatePosition);
      else setTranslatePosition(newPosition);
    }
  }, [carouselHeight, index, maxTranslatePosition, translatePosition]);

  const handlersObject = {
    onSwipedUp: () => handleChangeIndex(index + 1),
    onSwipedDown: () => handleChangeIndex(index - 1),
  };

  const handlers = useSwipeable({ ...handlersObject });

  return (
    <div {...handlers} className={`${styles.carousel}`}>
      {showButtons && (
        <button
          className={`${styles.button}`}
          type="button"
          disabled={translatePosition === 0}
          onClick={() => handleChangeIndex(index - 1)}
        >
          <IoIosArrowUp />
        </button>
      )}
      <div
        ref={carouselReference}
        className={styles.inner}
        style={{
          transform: `translateY(-${translatePosition}px)`,
        }}
      >
        {Children.map(children, (child) => (
          <div className={styles.item} style={{ height: `${itemDimension}%` }}>
            {cloneElement(child)}
          </div>
        ))}
      </div>
      {showButtons && (
        <button
          className={styles.button}
          type="button"
          disabled={translatePosition === maxTranslatePosition}
          onClick={() => handleChangeIndex(index + 1)}
        >
          <IoIosArrowDown />
        </button>
      )}
    </div>
  );
};

export default CarouselVertical;
