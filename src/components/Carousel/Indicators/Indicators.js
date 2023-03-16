import { useState } from 'react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';

import style from './Indicators.module.scss';

const Indicators = ({ itemsToShow, totalItems, handleClick, activeIndex }) => {
  const [total] = useState(Math.ceil(totalItems / itemsToShow));

  return (
    total > 1 && (
      <div className={style.indicators}>
        <button
          type="button"
          className={`${style.arrow} ${style.left}`}
          onClick={() => handleClick(activeIndex - 1)}
        >
          <IoIosArrowRoundBack />
        </button>
        {[...new Array(total).keys()].map((item, index) => (
          <button
            type="button"
            className={`${style.dot} ${activeIndex === index ? style.active : ''} ${
              index === total - 1 ? style.last : ''
            }`}
            key={item}
            aria-label="button change slide"
            onClick={() => handleClick(index)}
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
};

export default Indicators;
