import { useEffect, useRef, useState } from 'react';

import styles from './HeightAnimation.module.scss';

// Animation type: hover, button
// Hover animation need initial height higher than 0
function HeightAnimation({
  children,
  animationType,
  isOpen,
  initialHeight = 0,
  buttonTextActive = 'Show less',
  buttonTextInactive = 'Show more',
}) {
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
    if (!refChildren.current) return;
    const resizeObserver = new ResizeObserver(() => {
      calculateHeight();
      return undefined; // explicitly return undefined
    });
    resizeObserver.observe(refChildren.current);
    // eslint-disable-next-line consistent-return
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className={styles.HeightAnimation} style={{ maxHeight: `${actualHeight}px` }}>
        <div
          ref={refChildren}
          onLoad={calculateHeight}
          className={`${styles.children} ${
            animationType === 'hover' && actualHeight !== maxHeight && styles.hoverAnimation
          } `}
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
}

export default HeightAnimation;
