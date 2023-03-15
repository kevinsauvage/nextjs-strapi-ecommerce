import { useEffect, useRef, useState } from 'react';

import styles from './HeightAnimation.module.scss';

// Animation type: hover, button
// Hover animation need initial height higher than 0
const HeightAnimation = ({
  children,
  animationType,
  isOpen,
  initialHeight = 0,
  buttonTextActive = 'Show less',
  buttonTextInactive = 'Show more',
}) => {
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
    let resizeObserver;
    if (refChildren.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserver.observe(refChildren.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div className={styles.animation} style={{ maxHeight: `${actualHeight}px` }}>
        <div
          ref={refChildren}
          onLoad={calculateHeight}
          className={` ${animationType === 'hover' && actualHeight !== maxHeight && styles.hover} `}
          onMouseOver={() => animationType === 'hover' && setActualHeight(maxHeight)}
          onMouseLeave={() => animationType === 'hover' && setActualHeight(initialHeight)}
          onFocus={() => animationType === 'hover' && setActualHeight(maxHeight)}
          onBlur={() => animationType === 'hover' && setActualHeight(initialHeight)}
        >
          {children}
        </div>
      </div>
      {animationType === 'button' && (
        <button
          type="button"
          className={styles.button}
          onClick={() => setActualHeight((prev) => (prev === initialHeight ? maxHeight : initialHeight))}
        >
          {actualHeight ? buttonTextActive : buttonTextInactive}
        </button>
      )}
    </>
  );
};

export default HeightAnimation;
