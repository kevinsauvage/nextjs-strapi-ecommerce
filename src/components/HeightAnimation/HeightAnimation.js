import { useEffect, useRef, useState } from 'react';

import styles from './HeightAnimation.module.scss';

function HeightAnimation({ children, initialHeight = 0, animationType, isOpen }) {
  const refChildren = useRef();
  const [originalHeight, setOriginalHeight] = useState();
  const [actualHeight, setActualHeight] = useState();

  useEffect(() => {
    if (refChildren?.current && typeof originalHeight === 'undefined') {
      const elementRect = refChildren.current.getBoundingClientRect();
      const { height } = elementRect;
      if (height) setOriginalHeight(elementRect?.height);
      setActualHeight(initialHeight);
    }
  }, [initialHeight, originalHeight, refChildren]);

  useEffect(() => {
    if (isOpen) setActualHeight(originalHeight);
    else setActualHeight(initialHeight);
  }, [initialHeight, isOpen, originalHeight]);

  return (
    <div
      className={`${styles.HeightAnimation} ${
        animationType === 'hover' && actualHeight !== originalHeight && styles.hoverAnimation
      }`}
      onMouseOver={() => animationType === 'hover' && setActualHeight(originalHeight)}
      onMouseLeave={() => animationType === 'hover' && setActualHeight(initialHeight)}
      onFocus={() => animationType === 'hover' && setActualHeight(originalHeight)}
      onBlur={() => animationType === 'hover' && setActualHeight(initialHeight)}
    >
      <div ref={refChildren} className={styles.children} style={{ maxHeight: `${actualHeight}px` }}>
        {children}
      </div>
      {animationType === 'button' && (
        <button
          type="button"
          className={styles.button}
          onClick={() => setActualHeight((prev) => (prev === initialHeight ? originalHeight : initialHeight))}
        >
          {actualHeight ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

export default HeightAnimation;
