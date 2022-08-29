import { Children, useState } from 'react';
import styles from './Carousel.module.scss';

export default function Carousel({ children, itemsPerPage }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.inner}
        style={{ transform: `translateX(${current * 100})` }}
      >
        {Children.map(children, (child, index) => child)}
      </div>
    </div>
  );
}
