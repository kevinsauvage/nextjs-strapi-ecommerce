import { useEffect, useRef, useState } from 'react';

import styles from './HeightAnimation.module.scss';

// Animation type: hover, button
function HeightAnimation({ children, initialHeight = 0, animationType, isOpen }) {
  const refChildren = useRef();
  const [maxHeight, setMaxHeight] = useState();
  const [actualHeight, setActualHeight] = useState(initialHeight);

  useEffect(() => {
    if (!animationType) {
      if (isOpen) setActualHeight(maxHeight);
      else setActualHeight(initialHeight);
    }
  }, [animationType, initialHeight, isOpen, maxHeight]);

  function calculateHeight() {
    if (refChildren.current) {
      const newHeight = refChildren.current.scrollHeight;
      setMaxHeight(newHeight);
    }
  }

  useEffect(() => {
    calculateHeight();
  }, [children, isOpen]);

  return (
    <div
      className={`${styles.HeightAnimation} ${
        animationType === 'hover' && actualHeight !== maxHeight && styles.hoverAnimation
      }`}
      onMouseOver={() => animationType === 'hover' && setActualHeight(maxHeight)}
      onMouseLeave={() => animationType === 'hover' && setActualHeight(initialHeight)}
      onFocus={() => animationType === 'hover' && setActualHeight(maxHeight)}
      onBlur={() => animationType === 'hover' && setActualHeight(initialHeight)}
    >
      <div
        ref={refChildren}
        onLoad={calculateHeight}
        className={styles.children}
        style={{ maxHeight: `${actualHeight}px` }}
      >
        {children}
      </div>
      {animationType === 'button' && (
        <button
          type="button"
          className={styles.button}
          onClick={() => setActualHeight((prev) => (prev === initialHeight ? maxHeight : initialHeight))}
        >
          {actualHeight ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

export default HeightAnimation;
