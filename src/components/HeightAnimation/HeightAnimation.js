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
  const referenceChildren = useRef();
  const [maxHeight, setMaxHeight] = useState();
  const [actualHeight, setActualHeight] = useState(initialHeight);

  useEffect(() => {
    if (!animationType) {
      if (isOpen) setActualHeight(maxHeight);
      else setActualHeight(initialHeight);
    }
  }, [animationType, initialHeight, isOpen, maxHeight]);

  function calculateHeight() {
    if (referenceChildren.current) {
      const newHeight = referenceChildren.current.scrollHeight;
      setMaxHeight(newHeight);
    }
  }
  useEffect(() => {
    let resizeObserver;
    if (referenceChildren.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserver.observe(referenceChildren.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div className={styles.animation} style={{ maxHeight: `${actualHeight}px` }}>
        <div
          ref={referenceChildren}
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
          onClick={() =>
            setActualHeight((previous) => (previous === initialHeight ? maxHeight : initialHeight))
          }
        >
          {actualHeight ? buttonTextActive : buttonTextInactive}
        </button>
      )}
    </>
  );
};

export default HeightAnimation;
