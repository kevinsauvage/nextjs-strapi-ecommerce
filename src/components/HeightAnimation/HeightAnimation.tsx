'use client';

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
}: {
  children: React.ReactNode;
  animationType?: 'hover' | 'button';
  isOpen?: boolean;
  initialHeight?: number;
  buttonTextActive?: string;
  buttonTextInactive?: string;
}) => {
  const referenceChildren = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();
  const [actualHeight, setActualHeight] = useState(initialHeight);

  useEffect(() => {
    if (!animationType) {
      if (isOpen) setActualHeight(maxHeight);
      else setActualHeight(initialHeight);
    }
  }, [animationType, initialHeight, isOpen, maxHeight]);

  function calculateHeight() {
    if (referenceChildren.current?.scrollHeight) {
      setMaxHeight(referenceChildren.current.scrollHeight || 0);
    }
  }
  useEffect(() => {
    let resizeObserver = {} as ResizeObserver;
    if (referenceChildren.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserver.observe(referenceChildren.current);
    }
    return () => resizeObserver?.disconnect();
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
          {actualHeight === maxHeight ? buttonTextActive : buttonTextInactive}
        </button>
      )}
    </>
  );
};

export default HeightAnimation;
