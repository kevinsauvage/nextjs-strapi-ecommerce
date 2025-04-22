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
}: {
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number | string;
  className?: string;
  children: React.ReactNode;
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
