import { useState } from 'react';
import styles from './Tooltip.module.scss';

function Tooltip({ children, text }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.tooltip}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {showTooltip && <p className={styles.text}>{text}</p>}
    </div>
  );
}

export default Tooltip;
