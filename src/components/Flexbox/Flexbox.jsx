import React from 'react';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './Flexbox.module.scss';

const Flexbox = ({
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'nowrap',
  gap = 'medium',
  className = '',
  children,
}) => {
  const flexClasses = [
    styles.flexbox,
    styles[direction],
    styles[`justify-${justify}`],
    styles[`align-${align}`],
    styles[wrap],
    styles[`gap-${gap}`],
    className,
  ].join(' ');

  return <div className={flexClasses}>{children}</div>;
};

export default Flexbox;
