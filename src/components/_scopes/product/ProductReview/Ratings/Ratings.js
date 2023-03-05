import { useState } from 'react';

import styles from './Rating.module.scss';

export default function Rating({ rating, onChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(-1);
  const handleClick = (index) => onChange(index + 1);

  const stars = Array.from({ length: 5 }, (_, index) => (
    <button
      type="button"
      key={index}
      className={`${styles.star} ${index <= hoveredIndex ? styles.filled : ''} ${
        index < rating ? styles.filled : ''
      }`}
      onClick={() => handleClick(index)}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
    >
      ★
    </button>
  ));

  return <div className={styles.rating}>{stars}</div>;
}
