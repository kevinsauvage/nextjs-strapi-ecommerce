import { useState } from 'react';

import styles from './Tooltip.module.scss';

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
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
};

export default Tooltip;
