'use client';

import { useState } from 'react';

import { arrowRight } from '@/assets/svg';

import HeightAnimation from '../HeightAnimation/HeightAnimation';

import styles from './Collapsible.module.scss';

const Collapsible = ({
  children,
  title,
  extraClass = {},
}: {
  children: React.ReactNode;
  title: string;
  extraClass?: {
    container?: string;
    header?: string;
    children?: string;
  };
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.collapsible} ${open && styles.open} ${extraClass.container}`}>
      <button
        type="button"
        className={`${styles.header} ${extraClass.header}`}
        onClick={() => setOpen((previous) => !previous)}
      >
        <strong>{title}</strong>
        <div className={`${styles.icon} ${open && styles.open}`}>{arrowRight}</div>
      </button>
      <HeightAnimation isOpen={open}>
        <div className={extraClass.children}>{children}</div>
      </HeightAnimation>
    </div>
  );
};

export default Collapsible;
