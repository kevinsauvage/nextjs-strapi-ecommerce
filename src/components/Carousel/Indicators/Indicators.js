import { useState } from 'react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import style from './Indicators.module.scss';

export default function Indicators({
  itemsToShow,
  totalItems,
  handleClick,
  activeIndex,
}) {
  const [total] = useState(Math.ceil(totalItems / itemsToShow));

  return (
    total > 1 && (
      <div className={style.Indicators}>
        <button
          type="button"
          className={`${style.arrow} ${style.left}`}
          onClick={() => handleClick(activeIndex - 1)}
        >
          <IoIosArrowRoundBack />
        </button>
        {Array.from(Array(total).keys()).map((item, i) => (
          <button
            type="button"
            className={`${style.dot} ${activeIndex === i ? style.active : ''} ${
              i === total - 1 ? style.last : ''
            }`}
            key={item}
            aria-label="button change slide"
            onClick={() => handleClick(i)}
          />
        ))}
        <button
          type="button"
          className={`${style.arrow} ${style.right}`}
          onClick={() => handleClick(activeIndex + 1)}
        >
          <IoIosArrowRoundForward />
        </button>
      </div>
    )
  );
}
